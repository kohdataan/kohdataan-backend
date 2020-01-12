import axios from 'axios'
import db from '../../models'

const User = db.sequelize.model('User')
const Interest = db.sequelize.model('Interest')

const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

// This function takes a user, loops through all channels they are in, and calculates a new purpose for them based on users in the channel.
export const resetUserChannelsPurpose = async (req, res) => {
  // Set bearer token
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`

  try {
    // Get mmuser by searching email
    const mmUserData = await axios
      .post(`${mattermostUrl}/users/search`, {
        term: req.user.dataValues.email,
      })
      .then(user => user.data)
    // Get users channels in current team
    const userChannels = await axios
      .get(
        `${mattermostUrl}/users/${mmUserData[0].id}/teams/${
          process.env.TEAM_ID
        }/channels`
      )
      .then(channels => channels.data)
    // Loop through the returned channels, and set new channelpurposes
    userChannels.forEach(async channel => {
      // Also ignore town square and off-topic
      if (
        !(
          channel.display_name === 'Town Square' ||
          channel.display_name === 'Off-Topic'
        )
      ) {
        // Get all mattermost users currently in given channel
        const usersInChannel = await axios.get(`${mattermostUrl}/users`, {
          in_channel: channel.id,
        })
        // Get a list of promises that each return users interests
        const usersInterestsPromises = usersInChannel.data.map(
          mattermostUser => {
            return User.findOne({
              where: { email: mattermostUser.email },
              include: [
                {
                  model: Interest,
                  as: 'interests',
                  attributes: ['id', 'name'],
                  through: { attributes: [] },
                },
              ],
            })
              .then(fetchedUsers => {
                return fetchedUsers.interests
              })
              .catch(() => {
                return undefined
              })
          }
        )
        // Wait for the promises to resolve
        const usersInterests = await Promise.all(usersInterestsPromises)
        // Create empty object we are going to populate with the interests and set to be the purpose of the channel
        const allInterests = {}

        // Parse through the resolved promises
        usersInterests.forEach(interests => {
          // Each promise contains a list of interests, add them to the allInterests object
          // If user was not found (is undefined), do nothing
          if (interests) {
            interests.forEach(interest => {
              allInterests[interest.name] =
                interest.name in allInterests
                  ? (allInterests[interest.name] += 1)
                  : 1
            })
          }
        })
        // Update mattermost channel purpose to match its users interests
        await axios.put(`${mattermostUrl}/channels/${channel.id}/patch`, {
          purpose: JSON.stringify(allInterests),
        })
      }
    })
    return res.status(200).send({
      success: true,
      message: 'did it',
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error',
      error,
    })
  }
}

// This function adds given users interests to the channel purpose
export const addUserInterestsToPurpose = async (req, res) => {
  // Set bearer token
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`

  // Get channel id from request parameters
  const { channelId } = req.params
  // Get user from passport set user object
  const userId = req.user.dataValues.id

  try {
    // Make promises that return given mm channel and user interests.
    const channelPromise = axios.get(`${mattermostUrl}/channels/${channelId}`)
    const userPromise = User.findOne({
      where: { id: userId },
      include: [
        {
          model: Interest,
          as: 'interests',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    }).then(fetchedUser => {
      return fetchedUser.interests
    })
    // Wait for both of the promises to complete
    const completedPromises = await Promise.all([channelPromise, userPromise])
    // Get current channel purpose and make it into js object
    const channelPurpose = JSON.parse(completedPromises[0].data.purpose)
    // Go through fetched user interests and add them to the channel purpose
    completedPromises[1].forEach(interest => {
      channelPurpose[interest.name] =
        interest.name in channelPurpose
          ? (channelPurpose[interest.name] += 1)
          : 1
    })
    // Update mattermost channel purpose
    await axios.put(`${mattermostUrl}/channels/${channelId}/patch`, {
      purpose: JSON.stringify(channelPurpose),
    })
    return res.status(200).send({
      success: true,
      message: 'Channel interests updated',
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error',
      error,
    })
  }
}

export const removeUserInterestsFromPurpose = async (req, res) => {
  // Set bearer token
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`

  // Get channel id from request parameters
  const { channelId } = req.params
  // Get user from passport set user object
  const userId = req.user.dataValues.id

  try {
    // Make promises that return given mm channel and user interests.
    const channelPromise = axios.get(`${mattermostUrl}/channels/${channelId}`)
    const userPromise = User.findOne({
      where: { id: userId },
      include: [
        {
          model: Interest,
          as: 'interests',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    }).then(fetchedUser => {
      return fetchedUser.interests
    })
    // Wait for both of the promises to complete
    const completedPromises = await Promise.all([channelPromise, userPromise])
    // Get current channel purpose and make it into js object
    const channelPurpose = JSON.parse(completedPromises[0].data.purpose)
    // Go through fetched user interests and remove them from the channel purpose
    completedPromises[1].forEach(interest => {
      channelPurpose[interest.name] -= 1
      if (channelPurpose[interest.name] === 0)
        delete channelPurpose[interest.name]
    })
    // Update mattermost channel purpose
    await axios.put(`${mattermostUrl}/channels/${channelId}/patch`, {
      purpose: JSON.stringify(channelPurpose),
    })
    return res.status(200).send({
      success: true,
      message: 'Channel interests updated',
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error',
      error,
    })
  }
}
