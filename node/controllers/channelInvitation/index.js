import axios from 'axios'
import flatted from 'flatted'
import model from '../../models'

const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

const { User, Interest } = model

export const getChannelInvitation = (req, res) => {
  res.status(501).send('get all channel invitation')
}

export const getChannelInvitations = async (req, res) => {
  axios.defaults.headers.common.Authorization = `Bearer ${
    process.env.MASTER_TOKEN
  }`
  const { id } = req.user.dataValues

  if (!id) {
    return res.status(401).send({
      success: false,
      message: 'User id invalid',
    })
  }

  const getChannels = axios
    .get(`${mattermostUrl}/teams/${process.env.TEAM_ID}/channels`)
    .then(results => {
      return results
    })
    .catch(err => {
      return err
    })

  const userInterests = User.findAll({
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
    .then(results => {
      return results[0].interests
    })
    .catch(err => {
      return flatted.stringify(err)
    })

  const channelInvitations = await Promise.all([getChannels, userInterests])
    .then(results => {
      const { data } = results[0]
      const interests =
        results[1] && results[1].map(interest => interest.dataValues.name)
      const found =
        data && data.filter(channel => interests.includes(channel.display_name))
      return [found, interests]
    })
    .catch(err => flatted.stringify(err))

  try {
    const found = channelInvitations[0]
    const interests = channelInvitations[1]

    if (found.length === 0 && interests.length > 0) {
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

      const channels = channelPromises.map(channel => {
        return channel.data
      })

      res.status(200).send({
        success: true,
        message: 'Channel invitation',
        channels,
      })
    } else {
      res.status(200).send({
        success: true,
        message: 'Channels',
        found,
      })
    }
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: 'Error',
      error: e,
    })
  }
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
