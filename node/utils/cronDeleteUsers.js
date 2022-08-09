import dotenv from 'dotenv'
import model from '../models/index.js'
import axios from 'axios'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { updateMattermostUser } from '../controllers/user/index.js'

dotenv.config()
const { User } = model
import { Op } from 'sequelize'
import { CronJob } from 'cron'
import fs from 'fs'
import util from 'util'

// Set URL to Mattermost API.
const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

// Set default time to execute: at every 10th minute.
const cronExecTime =
  (process.env.CRON_EXEC_HOUR && process.env.CRON_EXEC_HOUR<=23 && process.env.CRON_EXEC_HOUR>=1 ? '0 '+process.env.CRON_EXEC_HOUR+' * * *' : '*/10 * * * *')

const deleteUsersTimed = () => {
  // Start CronJob
  const job = new CronJob(
    cronExecTime,
    async () => {
      try {
        // Write log to file
        const logFile = fs.createWriteStream('/var/log/node/node.log', { flags: 'a' })
        const logStdout = process.stdout
        console.log = function () {
          logFile.write(util.format.apply(null, arguments) + '\n')
          logStdout.write(util.format.apply(null, arguments) + '\n')
        }
        console.error = console.log
        // Start execution
        let timestampNow = new Date();
        console.log(timestampNow.toString()+': Starting scheduled user deletion process')
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
        console.log('Users to be permanently deleted: ', mmUsers)
        mmUsers.forEach(function(userOnHold) { 
        userOnHold.map(async mmuser => {
            const randomEmail = `${uuidv4()}@deleted.fi`
            console.log('The user is permanently deleted: '+mmuser.id+' > '+randomEmail)
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
            console.log('Deleted user: '+randomEmail+'('+affectedRows+')')
          })
      })
      } catch (err) {
        console.log('error while deleting users', err)
      }
    },
    null,
    true,
    'Europe/Helsinki'
  )

  job.start()
}

export default deleteUsersTimed
