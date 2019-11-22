import passport from 'passport'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'
import nodemailer from 'nodemailer'
import db from '../../models'

// The models here are retrieved through db because this way vscode knows they are sequelize models.
const PasswordResetUuid = db.sequelize.model('PasswordResetUuid')
const User = db.sequelize.model('User')
const LogoutToken = db.sequelize.model('LogoutToken')

const mattermostUrl =
  process.env.MATTERMOST_URL || 'http://mattermost:8000/api/v4'

export const login = (req, res) => {
  passport.authenticate(
    'local',
    {
      session: false,
    },
    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user,
        })
      }

      return req.login(
        user,
        {
          session: false,
        },
        error => {
          if (error) {
            res.send(error)
          }
          const token = jwt.sign(
            { user: user.dataValues, date: new Date() },
            process.env.JWT_SECRET
          )

          return res.json({
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
            token,
          })
        }
      )
    }
  )(req, res)
}

export const logout = (req, res) => {
  const { authToken } = req.body

  return LogoutToken.create({ token: authToken })
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'Succesfully logged out',
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Something went wrong',
        error: err.message,
      })
    })
}

export const forgot = async (req, res) => {
  const { email } = req.body

  return User.findOne({ where: { email } })
    .then(async user => {
      return PasswordResetUuid.create({ userId: user.id })
    })
    .then(async createdToken => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.TESTEMAIL,
          pass: process.env.TESTEMAILPASS,
        },
      })
      await transporter.sendMail({
        from: process.env.TESTEMAIL,
        to: email,
        subject: 'Password reset link',
        text: `${'Here is the link also change this message to something more suitable ' +
          'www.kohdataan.com/forgotPass?uuid='}${createdToken.dataValues.uuid}`,
      })
      res.status(201).send({
        success: true,
        message: 'Email found and uuid generated and stored',
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Email not found',
        error: err,
      })
    })
}

export const reset = async (req, res) => {
  const { uuid, password } = req.body

  return PasswordResetUuid.findOne({ where: { uuid } })
    .then(async passwordResetEntry => {
      const givenTime = Number(process.env.PASSWORD_RESET_TIME)
      const currentTime = new Date().getTime()
      const tokenTime = passwordResetEntry.createdAt.getTime()

      if (currentTime - tokenTime < givenTime && !passwordResetEntry.used) {
        await passwordResetEntry.update({
          used: true,
        })
        return User.findOne({ where: { id: passwordResetEntry.userId } })
      }
      // throw an error if token is expired, this causes the .then chain to go directly into .catch
      throw new Error('Given token has expired or has been used')
    })
    .then(async user => {
      await user.update({
        password: bcrypt.hashSync(password, 12),
      })
      axios.defaults.headers.common.Authorization = `Bearer ${
        process.env.MASTER_TOKEN
      }`
      return axios.post(`${mattermostUrl}/users/search`, {
        term: user.email,
      })
    })
    .then(async mattermostUser => {
      await axios.put(
        `${mattermostUrl}/users/${mattermostUser.data[0].id}/password`,
        {
          new_password: password,
        }
      )
      res.status(200).send({
        success: true,
        message: 'Password changed succesfully',
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: 'Something went wrong',
        error: err.message,
      })
    })
}
