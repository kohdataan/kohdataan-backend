import passport from 'passport'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'
import db from '../../models'
import sendMail from '../../utils/mailSender'

// The models here are retrieved through db because this way vscode knows they are sequelize models.
const PasswordResetUuid = db.sequelize.model('PasswordResetUuid')
const User = db.sequelize.model('User')

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
          const token = jwt.sign(user.dataValues, process.env.JWT_SECRET)

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
  res.status(501).send('not yet implemented')
}

export const forgot = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    const createdToken = await PasswordResetUuid.create({ userId: user.id })
    const emailToSent = `Hei, meille tuli pyyntö resetoida salasanasi, tässä linkki josta pääset tekemään sen: 
      \nwww.kohdataan.com/forgotPass?uuid=${createdToken.uuid}`
    await sendMail(email, 'PasswordResetLink', emailToSent)
    res.status(201).send({
      success: true,
      message: 'Email found and uuid generated and stored',
    })
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error: err,
    })
  }
}

export const reset = async (req, res) => {
  const { uuid, password } = req.body

  try {
    // Check the token is still valid and if so update 'used' value
    // If the token is not valid, throw and error
    const passwordResetEntry = await PasswordResetUuid.findOne({
      where: { uuid },
    })
    const givenTime = Number(process.env.PASSWORD_RESET_TIME)
    const currentTime = new Date().getTime()
    const tokenTime = passwordResetEntry.createdAt.getTime()
    if (currentTime - tokenTime > givenTime || passwordResetEntry.used) {
      throw new Error('Given token has expired or has been used')
    }
    await passwordResetEntry.update({
      used: true,
    })
    // Update node user password
    const user = await User.findOne({
      where: { id: passwordResetEntry.userId },
    })
    await user.update({
      password: bcrypt.hashSync(password, 12),
    })
    // Update mattermost user password
    axios.defaults.headers.common.Authorization = `Bearer ${
      process.env.MASTER_TOKEN
    }`
    const mattermostUser = await axios.post(`${mattermostUrl}/users/search`, {
      term: user.email,
    })
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
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error: err,
    })
  }
}
