import { Sequelize } from 'sequelize'

/* Database models */
import BlockedUser from './blockeduser.js'
import EmailVerificationUuid from './emailverificationuuid.js'
import Interest from './interest.js'
import PasswordResetUuid from './passwordresetuuid.js'
import SentSms from './sentsms.js'
import User from './user.js'
import UserInterest from './userinterest.js'

/* Insert all active database models in the array */
const models = [BlockedUser, EmailVerificationUuid, Interest, PasswordResetUuid, SentSms, User, UserInterest]

const env = process.env.NODE_ENV || 'development'
import configPath from '../database/config/config.json' assert { type: 'json' }

const config = configPath[env]

const db = {}

/** @type {Sequelize} */
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

models.forEach(defineModel => {
    const model = defineModel(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
