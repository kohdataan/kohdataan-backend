import axios from 'axios'
import flatted from 'flatted'
import uuidv4 from 'uuid/v4'
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

  // Set the axios header token
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`
  // Make a promise that returns all given user interests
  const userInterestsPromise = User.findOne({
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
    .then(result => {
      return result.interests
    })
    .catch(err => {
      return flatted.stringify(err)
    })

  // Make a promise that returns all channels
  const channelsPromise = axios.get(
    `${mattermostUrl}/teams/${process.env.TEAM_ID}/channels`
  )

  try {
    // Wait till both promises are done, and map values into stuff we want
    // interestsPromise becomes a list that just contains calling users interests
    // channelsPromise becomes a list containing all channel stats
    // we also add channel member count into returned channel data (it is not normally in channels, but in channels stats)
    // Here we also use await and .then because we want data to contain the values returned from .then
    const data = await Promise.all([
      userInterestsPromise,
      channelsPromise,
    ]).then(async results => {
      // Convert results[0] (the interests) into a form that only has the interest name
      const interests = results[0] && results[0].map(interest => interest.name)

      // Here we gather all relevant data about channels into simple objects, we also prune away town-square and off-topic
      const channelsData =
        // If results[1].data is defined..
        results[1].data &&
        // ..we wait for all promises returned by map to finish.
        (await Promise.all(
          results[1].data.map(async channelData => {
            // Just return undefined if currently processed channel is either one of the 'stock' ones
            if (
              channelData.name === 'town-square' ||
              channelData.name === 'off-topic'
            ) {
              return undefined
            }
            // Fetch stats for the channel (only thing we want from here is the member count)
            const channelStats = await axios.get(
              `${mattermostUrl}/channels/${channelData.id}/stats`
            )
            // Add the membercount variable to channelData
            // The given parameter was fetched for this purpose and is disregarded after, so we do not care if we modify it here.
            // eslint-disable-next-line no-param-reassign
            channelData.memberCount = channelStats.data.member_count
            // Also parse channel purpose to js object
            // eslint-disable-next-line no-param-reassign
            channelData.purpose = JSON.parse(channelData.purpose)
            return channelData
          })
        ))
      return [interests, channelsData]
    })

    // Filter away the channels that are not defined and that contain too many people
    const channelsWithRoom = data[1].filter(channelData => {
      return channelData && channelData.memberCount < 8
    })

    // Make a cache, so that we do not need to calculate how well channel suits user every time in a sort
    // Values here are the sum of channel interests from channel purpose that are shared with users interests
    const channelsPurposeValueCache = {}
    channelsWithRoom.sort((channel1, channel2) => {
      // Check that first channel in this comparison is in cache, add it if not
      if (!channelsPurposeValueCache[channel1.id]) {
        let channelPurposeValue = 0
        data[0].forEach(interest => {
          if (channel1.purpose[interest]) {
            channelPurposeValue += channel1.purpose[interest]
          }
        })
        channelsPurposeValueCache[channel1.id] = channelPurposeValue
      }
      // Check that second channel in this comparison is in cache, add it if not
      if (!channelsPurposeValueCache[channel2.id]) {
        let channelPurposeValue = 0
        data[0].forEach(interest => {
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

    const newChannels = []
    // Check if we found enough new channels
    if (channelsWithRoom.length < 10) {
      // How many need to be made?
      let newChannelsAmount = 10 - channelsWithRoom.length
      // Create promises that each make a new channel
      while (newChannelsAmount > 0) {
        newChannels.push(
          axios
            .post(`${mattermostUrl}/channels`, {
              team_id: process.env.TEAM_ID,
              name: uuidv4(),
              display_name: generateChannelName(),
              purpose: JSON.stringify({}),
              type: 'O',
            })
            .then(createdChannel => {
              return createdChannel.data
            })
        )
        // Make enough new channels so that there are 10 in total
        newChannelsAmount -= 1
      }
      // Wait for new channels to be made
      await Promise.all(newChannels)
    }

    console.log('RETURNING')
    console.log(await channelsWithRoom.concat(newChannels))

    return res.status(200).send({
      success: true,
      message: 'Channels',
      found: await channelsWithRoom.concat(newChannels),
    })
  } catch (error) {
    return res.status(401).send({
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
