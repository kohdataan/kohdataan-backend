import axios from 'axios'
import flatted from 'flatted'
import db from '../../models'

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

  // Wait till both promises are done, and map values into stuff we want
  // interestsPromise becomes a list that just contains calling users interests
  // channelsPromise becomes a list containing all channel stats
  // we also extract channel purpose (all interests of the channel) into a seperate variable and return it also.
  // Here we also use await and .then because we want data to contain the values returned from .then
  const data = await Promise.all([userInterestsPromise, channelsPromise]).then(
    async results => {
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
            // eslint-disable-next-line no-param-reassign
            channelData.purpose = JSON.parse(channelData.purpose)
            return channelData
          })
        ))
      return [interests, channelsData]
    }
  )

  // Filter away the channels that are not defined and that contain too many people
  const channelsWithRoom = data[1].filter(channelData => {
    return channelData && channelData.memberCount < 8
  })

  console.log('HERE ARE THE CHANNELS THAT SHOULD HAVE ROOM')
  console.log(channelsWithRoom)

  const usedChannelIds = []
  const foundChannels = {}
  data[0].forEach(interest => {
    let currentBestChannel
    channelsWithRoom.forEach(channel => {
      console.log('NOW PROCESSING CHANNEL')
      console.log(channel)
      console.log(channel.purpose)
      if (channel.purpose) {
        console.log(Object.keys(channel.purpose))
        console.log(Object.values(channel.purpose))
        console.log(Object.keys(channel.purpose).length)
        console.log(Object.keys(channel.purpose).includes(interest))
      }
      if (
        channel.purpose &&
        (Object.keys(channel.purpose).length === 0 ||
          Object.keys(channel.purpose).includes(interest)) &&
        !usedChannelIds.includes(channel.id)
      ) {
        console.log('THIS CHANNEL HAs A PURPOSE WHICH IS EMPTY OR CONTAINS SAME INTERESTS, ALSO IT IS NOT YET USED')
        console.log(channel)
        if (
          !currentBestChannel ||
          !currentBestChannel.purpose[interest] ||
          (channel.purpose[interest] &&
            currentBestChannel.purpose[interest] < channel.purpose[interest])
        ) {
          currentBestChannel = channel
        }
      }
    })
    if (currentBestChannel) {
      usedChannelIds.push(currentBestChannel.id)
      foundChannels[interest] = currentBestChannel
    }
  })

  console.log('HERE ARE THE CHANNELS THAT WE HAVE FOUND THAT YOU MIGHT ENJOY')
  console.log(foundChannels)

  if (data[0].length > Object.keys(foundChannels).length) {
    console.log('CREATING NEW CHANNELS')
    const foundAndNewChannels = await Promise.all(
      data[0].map(interest => {
        if (!Object.keys(foundChannels).includes(interest)) {
          console.log(`Creating channel for ${interest}`)
          const name =
            interest.replace(/\W/g, '').toLowerCase() + Date.now().toString()
          return axios.post(`${mattermostUrl}/channels`, {
            team_id: process.env.TEAM_ID,
            name,
            display_name: interest,
            purpose: JSON.stringify({}),
            type: 'O',
          })
        }
        return foundChannels[interest]
      })
    )
    const allChannelsInCorrectForm = foundAndNewChannels.map(channel => {
      if (channel.data) {
        return channel.data
      }
      return channel
    })
    return res.status(200).send({
      success: true,
      message: 'Channel invitation',
      found: allChannelsInCorrectForm,
    })
  }
  return res.status(200).send({
    success: true,
    message: 'Channels',
    found: Object.values(foundChannels),
  })
  /*
  // Here we return array that has a list of interests, and a list of channels which have the same name
  // as one of the interests. These values are stored in variable 'channelInvitations' above.
    .then(results => {
      const interests =
        results[0] && results[0].map(interest => interest.dataValues.name)
      const { data } = results[1]
      const found =
        data && data.filter(channel => interests.includes(channel.display_name))
      return [found, interests]
    })
    .catch(err => {
      flatted.stringify(err)
      return []
    })

  // If this fails, we will just return an error..
  try {
    // Here we get a list of stats for every channel that had a name relating to current interests
    const channelsPromises =
      channelInvitations[0] &&
      (await Promise.all(
        channelInvitations[0].map(channel => {
          return axios.get(`${mattermostUrl}/channels/${channel.id}/stats`)
        })
      ))

    // Here we filter out the channels that have eight or more people, and return their id.
    const channelsWithRoom = channelsPromises
      .filter(result => result.data.member_count < 8)
      .map(result => result.data.channel_id)

    // Make a new array to hold interests that we have already found channels for..
    let exhaustedInterests = []

    // Get a list of channels with room, without duplicates of same interest types.
    const found = channelInvitations[0].filter(channel => {
      if (
        channelsWithRoom.includes(channel.id) &&
        !exhaustedInterests.includes(channel.display_name)
      ) {
        exhaustedInterests = [...exhaustedInterests, channel.display_name]
        return true
      }
      return false
    })

    // Get user interests
    const userInterests = channelInvitations[1]
    // Get a list of user interests based on channels found so far
    const channelInterests = found.map(channel => channel.display_name)

    // Get a list of interests that we have not yet found a channel for
    const interests = userInterests.filter(
      interest => !channelInterests.includes(interest)
    )

    // If there are any interests that do not yet have a channel..
    if (interests.length > 0) {
      // Create new channels for the interests that did not yet have a channel
      const channelPromises = await Promise.all(
        interests.map(interest => {
          const displayName =
            interest.replace(/\W/g, '').toLowerCase() + Date.now().toString()

          return axios.post(`${mattermostUrl}/channels`, {
            team_id: process.env.TEAM_ID,
            name: displayName,
            display_name: interest,
            type: 'O',
          })
        })
      )

      const newChannels = channelPromises.map(channel => {
        return channel.data
      })

      const channels = [...found, ...newChannels]

      return res.status(200).send({
        success: true,
        message: 'Channel invitation',
        channels,
      })
    }
    return res.status(200).send({
      success: true,
      message: 'Channels',
      found,
    })
  } catch (e) {
    console.log(e)
    return res.status(500).send({
      success: false,
      message: 'Error',
      error: e,
    })
  }
  */
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
