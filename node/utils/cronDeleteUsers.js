import dotenv from 'dotenv'
import model from '../models'
import axios from 'axios'
import moment from 'moment'
import uuidv4 from 'uuid/v4'
import { updateMattermostUser } from '../controllers/user'

dotenv.config()
const { User } = model
const { Op } = require('sequelize')
var CronJob = require('cron').CronJob
var fs = require('fs')
var util = require('util')
var logFile = fs.createWriteStream('/var/log/node/node.log', { flags: 'a' })

// Set URL to Mattermost API.
const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

// Set default time to execute: at every 10th minute.
const cronExecTime =
  (process.env.CRON_EXEC_HOUR ? (process.env.CRON_EXEC_HOUR<=23 && process.env.CRON_EXEC_HOUR>=1 ? '0 '+process.env.CRON_EXEC_HOUR+' * * *' : '*/10 * * * *') : '*/10 * * * *')

const deleteUsersTimed = () => {
  // Start CronJob
  const job = new CronJob(
    cronExecTime,
    async () => {
      try {
        // Write log to file
        var logFile = fs.createWriteStream('/var/log/node/node.log', { flags: 'a' })
        var logStdout = process.stdout
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
