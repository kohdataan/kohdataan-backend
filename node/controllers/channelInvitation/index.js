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

  // Wait till both promises are done and we have their return values
  const channelInvitations = await Promise.all([
    userInterestsPromise,
    channelsPromise,
  ])
    // Here we return array that has a list of interests, and a list of channels which have the same name
    // as one of the interests. These values are stored in variable 'channelInvitations' above.
    .then(results => {
      console.log(results[1])
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
