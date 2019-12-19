import axios from 'axios'
import db from '../../models'

const User = db.sequelize.model('User')
const Interest = db.sequelize.model('Interest')

const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

// eslint-disable-next-line import/prefer-default-export
export const resetChannelPurpose = async (req, res) => {
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`

  const channelId = req.body.id

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
