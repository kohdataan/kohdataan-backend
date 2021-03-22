import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import db from '../../models'
import generateChannelName from '../../utils/channelNameGenerator'

const User = db.sequelize.model('User')
const Interest = db.sequelize.model('Interest')

const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

export const getChannelInvitations = async (req, res) => {
  // Check that user has logged in and get the user datavalues
  // (this part really does not make sense since passport sets the req.user, and it does not let
  // the request get this far without setting it. I am however too afraid to touch it because something might break)
  const { id } = req.user.dataValues
  if (!id) {
    return res.status(401).send({
      success: false,
      message: 'User id invalid',
    })
  }

  try {
    // Set the axios header token
    axios.defaults.headers.common.Authorization = `Bearer ${
      process.env.MASTER_TOKEN
    }`

    // get a user that has linked all its interests
    const userInterests = await User.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Interest,
          as: 'interests',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    })

    // Get all channel data from mattermost (result is paginated but 2000 results should be enough)
    const allChannels = await axios.get(
      `${mattermostUrl}/teams/${process.env.TEAM_ID}/channels`,
      {
        per_page: 2000,
      }
    )

    // This list will hold all requesting user interests
    const interestsData =
      userInterests.interests &&
      userInterests.interests.map(interest => interest.name)
    // This list will hold all channels data (minus town-square and off-topic as they are stock channels)
    let channelsData =
      allChannels.data &&
      allChannels.data
        .filter(
          channelData =>
            channelData.name !== 'town-square' &&
            channelData.name !== 'off-topic' &&
            channelData.delete_at === 0
        )
        .map(async channelData => {
          const newChannelData = { ...channelData }
          const channelStats = await axios.get(
            `${mattermostUrl}/channels/${channelData.id}/stats`
          )
          // Add the membercount variable to channelData
          newChannelData.memberCount = channelStats.data.member_count
          // Also parse channel purpose to js object
          newChannelData.purpose =
            channelData &&
            channelData.purpose &&
            JSON.parse(channelData.purpose)
          return newChannelData
        })

    // Await for promises made in .map to finish
    channelsData = await Promise.all(channelsData)
    // Filter away channels that are too full
    channelsData = channelsData.filter(channel => channel.memberCount < 14)
    // Make a cache, so that we do not need to calculate how well channel suits user every time in a sort
    // Values here are the sum of channel interests from channel purpose that are shared with users interests
    const channelsPurposeValueCache = {}
    channelsData.sort((channel1, channel2) => {
      // Check that first channel in this comparison is in cache, add it if not
      if (!channelsPurposeValueCache[channel1.id]) {
        let channelPurposeValue = 0
        interestsData.forEach(interest => {
          if (channel1.purpose[interest]) {
            channelPurposeValue += channel1.purpose[interest]
          }
        })
        channelsPurposeValueCache[channel1.id] = channelPurposeValue
      }
      // Check that second channel in this comparison is in cache, add it if not
      if (!channelsPurposeValueCache[channel2.id]) {
        let channelPurposeValue = 0
        interestsData.forEach(interest => {
          if (channel2.purpose[interest]) {
            channelPurposeValue += channel2.purpose[interest]
          }
        })
        channelsPurposeValueCache[channel2.id] = channelPurposeValue
      }
      // return result of this comparison from the cache
      return (
        channelsPurposeValueCache[channel2.id] -
        channelsPurposeValueCache[channel1.id]
      )
    })

    let newChannels = []
    // This keeps all the to-be-generated channel names to avoid duplicates
    const newChannelNames = []

    // Check if we found enough new channels
    if (channelsData.length < 5) {
      // How many need to be made?
      let newChannelsAmount = 5 - channelsData.length
      // Create promises that each make a new channel
      while (newChannelsAmount > 0) {
        const channelName = await generateChannelName(
          allChannels,
          newChannelNames
        )
        newChannels.push(
          axios.post(`${mattermostUrl}/channels`, {
            team_id: process.env.TEAM_ID,
            name: uuidv4(),
            display_name: channelName,
            purpose: JSON.stringify({}),
            type: 'O',
          })
        )
        newChannelNames.push(channelName)
        // Make enough new channels so that there are 5 in total
        newChannelsAmount -= 1
      }
      // Wait for new channels to be made
      newChannels = await Promise.all(newChannels)
      // Get the data values from axios returned object
      newChannels = newChannels.map(newChannel => {
        const newChannelData = newChannel.data
        newChannelData.purpose = {}
        return newChannelData
      })
    } else {
      channelsData = channelsData.slice(0, 5)
    }
    const found = channelsData.concat(newChannels)

    return res.status(200).send({
      success: true,
      message: 'Channels',
      found,
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    })
  }
}

export const getChannelInvitation = (req, res) => {
  res.status(501).send('get all channel invitation')
}

export const addChannelInvitation = (req, res) => {
  res.status(501).send('add channel invitation')
}

export const updateChannelInvitation = (req, res) => {
  res.status(501).send('put channel invitation')
}

export const deleteChannelInvitation = (req, res) => {
  res.status(501).send('delete channel invitation')
}
