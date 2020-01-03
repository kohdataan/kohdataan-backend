import axios from 'axios'
import db from '../../models'

const User = db.sequelize.model('User')
const Interest = db.sequelize.model('Interest')

const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

// this function looks at current users of a channel, and build a purpose based on them
export const resetChannelPurpose = async (req, res) => {
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`

  const { channelId } = req.body

  try {
    // Get all mattermost users currently in given channel
    const usersInChannel = await axios.get(`${mattermostUrl}/users`, {
      in_channel: channelId,
    })
    // Get a list of promises that each return a user in database
    const usersPromises = usersInChannel.data.map(mattermostUser =>
      User.findOne({ where: { email: mattermostUser.email } })
    )
    // Wait for the promises to resolve
    const users = await Promise.all(usersPromises)

    // Get a list of promises that each return a list of users interests
    const interestsPromises = []
    users.forEach(user => {
      // Only run for users that were found in node database
      if (user) {
        interestsPromises.push(
          User.findOne({
            where: { id: user.id },
            include: [
              {
                model: Interest,
                as: 'interests',
                attributes: ['id', 'name'],
                through: { attributes: [] },
              },
            ],
          }).then(fetchedUsers => {
            return fetchedUsers.interests
          })
        )
      }
    })
    // Wait for the interest promises to resolve
    const completedInterestPromises = await Promise.all(interestsPromises)
    const allInterests = {}

    // Parse through the resolved promises
    completedInterestPromises.forEach(completedPromise => {
      // Each promise contains a list of interests, add them to the allInterests object
      completedPromise.forEach(interest => {
        allInterests[interest.name] =
          interest.name in allInterests ? (allInterests[interest.name] += 1) : 1
      })
    })
    // Update mattermost channel purpose to match its users interests
    await axios.put(`${mattermostUrl}/channels/${channelId}/patch`, {
      purpose: JSON.stringify(allInterests),
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

// This function adds given users interests to the channel purpose
export const addUserInterestsToPurpose = async (req, res) => {
  // Set bearer token
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`

  // Get channel id and user id from request body
  const { channelId } = req.body
  const { userId } = req.body

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

  // Get channel id and user id from request body
  const { channelId } = req.body
  const { userId } = req.body

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
