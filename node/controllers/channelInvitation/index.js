import axios from 'axios'
import model from '../../models'

const mattermostUrl = 'http://mattermost:8000/api/v4'

const { User, Interest } = model

export const getChannelInvitation = (req, res) => {
  res.status(501).send('get all channel invitation')
}

export const getChannelInvitations = (req, res) => {
  axios.defaults.headers.common.Authorization =
    'Bearer xefuizt693rwznw6gbj9bbwwih'
  const { id } = req.user.dataValues

  const getChannels = axios
    .get(`${mattermostUrl}/teams/rb391tirmjgkxgnhdeouc6x7or/channels`)
    .then(results => {
      return results
    })
    .catch(err => {
      // console.log(err)
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
      // console.log(err)
      return err
    })

  Promise.all([getChannels, userInterests])
    .then(results => {
      const { data } = results[0]
      const interests = results[1].map(interest => interest.dataValues.name)
      const found = data.filter(channel =>
        interests.includes(channel.display_name)
      )
      const displayName = Date.now().toString()
      if (found.length === 0 && interests.length > 0) {
        axios
          .post(`${mattermostUrl}/channels`, {
            team_id: 'rb391tirmjgkxgnhdeouc6x7or',
            name: displayName,
            display_name: interests[0],
            type: 'O',
          })
          .then(newChannel => {
            // eslint-disable-next-line no-shadow
            const { data } = newChannel
            res.status(200).send({
              success: true,
              message: 'Channel invitation',
              channel: data,
            })
          })
      } else {
        res.status(200).send({
          success: true,
          message: 'Channels',
          found,
        })
      }
    })
    .catch(err => console.log(err))
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
