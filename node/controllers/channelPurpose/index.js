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
    const axiosMmUserData = await axios.post(`${mattermostUrl}/users/search`, {
      term: req.user.dataValues.email,
    })
    // Get users channels in current team
    const axiosUserChannelsData = await axios.get(
      `${mattermostUrl}/users/${axiosMmUserData.data[0].id}/teams/${
        process.env.TEAM_ID
      }/channels`
    )
    // Loop through the returned channels, and set new channelpurposes
    axiosUserChannelsData.data.forEach(async channel => {
      // Also ignore town square and off-topic
      if (
        !(
          channel.display_name === 'Town Square' ||
          channel.display_name === 'Off-Topic'
        )
      ) {
        // Get all mattermost users currently in given channel
        const axiosUsersInChannelData = await axios.get(
          `${mattermostUrl}/users`, {
            params: {
              in_channel: channel.id,
            }
          }
        )
        // Get a list of promises that each return users with their interests
        const usersInterestsPromises = axiosUsersInChannelData.data.map(
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
          }
        )
        // Wait for the promises to resolve
        const usersAndTheirInterests = await Promise.all(usersInterestsPromises)
        // Create empty object we are going to populate with the interests and set to be the purpose of the channel
        const allInterests = {}
        // go through all found users
        usersAndTheirInterests.forEach(user => {
          // If the user is found (is not only in mattermost, like dev)
          if (user) {
            // Add every interest into allInterest -object
            user.interests.forEach(interest => {
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
    })
    // Wait for both of the promises to complete
    const completedPromises = await Promise.all([channelPromise, userPromise])
    // Get current channel purpose and make it into js object
    const channelPurpose =
      completedPromises[0] &&
      completedPromises[0].data.purpose &&
      JSON.parse(completedPromises[0].data.purpose)
    // Go through fetched user interests and add them to the channel purpose
    completedPromises[1].interests.forEach(interest => {
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
    })
    // Wait for both of the promises to complete
    const completedPromises = await Promise.all([channelPromise, userPromise])
    // Get current channel purpose and make it into js object
    const channelPurpose =
      completedPromises[0] &&
      completedPromises[0].data.purpose &&
      JSON.parse(completedPromises[0].data.purpose)
    // Go through fetched user interests and remove them from the channel purpose
    completedPromises[1].interests.forEach(interest => {
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

// This function is to be used only by frontend script to correct previous calculation errors
export const resetPurposeForAllChannels = async (req, res) => {
  // Set bearer token
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`

  try {
    // Get all channels in current team
    const axiosChannelsData = await axios.get(
      `${mattermostUrl}/teams/${
        process.env.TEAM_ID
      }/channels`
    )
    // Loop through the returned channels, and set new channelpurposes
    axiosChannelsData.data.forEach(async channel => {
      // Also ignore town square and off-topic
      if (
        !(
          channel.display_name === 'Town Square' ||
          channel.display_name === 'Off-Topic'
        )
      ) {
        // Get all mattermost users currently in given channel
        const axiosUsersInChannelData = await axios.get(
          `${mattermostUrl}/users`, {
            params: {
              in_channel: channel.id,
            }
          }
        )
        // Get a list of promises that each return users with their interests
        const usersInterestsPromises = axiosUsersInChannelData.data.map(
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
          }
        )
        // Wait for the promises to resolve
        const usersAndTheirInterests = await Promise.all(usersInterestsPromises)
        // Create empty object we are going to populate with the interests and set to be the purpose of the channel
        const allInterests = {}
        // go through all found users
        usersAndTheirInterests.forEach(user => {
          // If the user is found (is not only in mattermost, like dev)
          if (user) {
            // Add every interest into allInterest -object
            user.interests.forEach(interest => {
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
      message: 'All channel purposes updated',
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error in updating channel purposes',
      error,
    })
  }
}
