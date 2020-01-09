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
  // we also add channel member count into returned channel data (it is not normally in channels, but in channels stats)
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
            // Also parse channel purpose to js object
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

  // Now that we have a list of users interests (data[0]) and list of non full channels (data[1]), we can search for the best ones
  // In this implementation, we search for best channel for every interest, so we make an object, thats keys are interests, and values are channel data
  const foundChannels = {}
  // Also lets store already used channel ids
  const usedChannels = []
  data[0].forEach(interest => {
    let currentBestChannel
    // Loop through every channel for every interest (there is at max 5 interests so its not that bad)
    channelsWithRoom.forEach(channel => {
      // Check that channel fits this interest
      if (
        // Check channel has a purpose
        channel.purpose &&
        // Check that channel is not yet used for another interest
        !usedChannels.includes(channel.id) &&
        // Check that channel purpose is either empty, or contains atleast one same interest as our user
        (Object.keys(channel.purpose).length === 0 ||
          Object.keys(channel.purpose).includes(interest))
      ) {
        // Now we check if currently processing channel is better than currently selected channel for this interest
        if (
          // Check if we have found some other channel, if not, stop here and set currently processing channel to be currentBestChannel
          !currentBestChannel ||
          // Check that currentBestChannel purpose is not empty
          // If it is empty, stop here and set currentBestChannel
          !currentBestChannel.purpose[interest] ||
          // Check that our currently processing channel also has a purpose that contains user interest, if so check that its value is bigger than current best
          (channel.purpose[interest] &&
            currentBestChannel.purpose[interest] < channel.purpose[interest])
        ) {
          currentBestChannel = channel
        }
      }
    })
    // If we have found a channel for interest, set it in foundChannels.
    if (currentBestChannel) {
      foundChannels[interest] = currentBestChannel
      usedChannels.push(currentBestChannel.id)
    }
  })

  // If we did not find enough channels, we need to create more.
  if (data[0].length > Object.keys(foundChannels).length) {
    const foundAndNewChannels = await Promise.all(
      data[0].map(interest => {
        // Check if we have already found channel for this interest, if not, create it.
        if (!Object.keys(foundChannels).includes(interest)) {
          return axios
            .post(`${mattermostUrl}/channels`, {
              team_id: process.env.TEAM_ID,
              name:
                interest.replace(/\W/g, '').toLowerCase() +
                Date.now().toString(),
              display_name: interest,
              purpose: JSON.stringify({}),
              type: 'O',
            })
            .then(createdChannel => {
              return createdChannel.data
            })
        }
        // If we already had a channel for interest, return the value (channelData)
        return foundChannels[interest]
      })
    )

    return res.status(200).send({
      success: true,
      message: 'Channels',
      found: foundAndNewChannels,
    })
  }
  // If we found enough channels, just return them as a list of channel datas
  return res.status(200).send({
    success: true,
    message: 'Channels',
    found: Object.values(foundChannels),
  })
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
