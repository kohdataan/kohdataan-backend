import model from '../models'
import axios from 'axios'
import moment from 'moment'
import uuidv4 from 'uuid/v4'
import { updateMattermostUser } from '../controllers/user'

const { User } = model
const { Op } = require('sequelize')
var CronJob = require('cron').CronJob
const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

const deleteUsersTimed = () => {
  // Run once a day
  const job = new CronJob(
    '0 8 * * *',
    async () => {
      try {
        console.log('Starting timed user deletion process')
        const users = await User.findAll({
          where: {
            deleteAt: {
              [Op.not]: null,
            },
          },
        })
        console.log('Users that have deleteAt timestamp', users)

        const usersArr = users.map(el => el.get({ plain: true }))

        axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
        const promisesArr = []
        // Get all users where deleteAt is more than 7 days ago and find related mmusers
        usersArr
          .filter(user => moment().diff(moment(user.deleteAt), 'days') >= 7)
          .forEach(user => {
            promisesArr.push(
              axios.post(`${mattermostUrl}/users/search`, {
                term: user.email,
              })
            )
          })

        let mmUsers = await Promise.all(promisesArr)
        mmUsers = mmUsers.map(resp => resp.data)
        mmUsers &&
          mmUsers[0] &&
          mmUsers[0].map(async mmuser => {
            console.log('User will be removed:', mmuser)
            const randomEmail = `${uuidv4()}@deleted.fi`
            // Change email to random
            await updateMattermostUser(mmuser.id, null, null, randomEmail)
            // Deactivate mm account
            axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
            await axios.delete(`${mattermostUrl}/users/${mmuser.id}`)
            // Only after mattermost user is successfully deactivated, delete also node-user
            const affectedRows = await User.destroy({
              where: {
                email: mmuser.email,
              },
            })
            console.log('deleted node user', affectedRows)
          })
      } catch (err) {
        console.log('error while deleting users', err)
      }
    },
    null,
    true,
    'America/Los_Angeles'
  )

  job.start()
}

export default deleteUsersTimed
