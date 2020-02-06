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

      if (!user.emailVerified) {
        return res.status(401).json({
          message: 'Email needs to be verified',
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
  /*
  This path is protected, so you need to be logged in to access it and receive 200 status.
  Because we use jwt tokens, you cannot really log out, but if we implement
  some sort of session based system, handle logging out here.
  */
  res.status(200).send({
    success: true,
    message: 'Succesfully logged out',
  })
}

export const forgot = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    const createdToken = await PasswordResetUuid.create({ userId: user.id })
    const emailToSent = `Hei, meille tuli pyyntö vaihtaa salasanasi. \nTässä on linkki, josta pääset tekemään sen: ${process.env.FRONTEND_URL}/forgotPass?uuid=${createdToken.uuid}`
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

export const updatePassword = async (req, res) => {
  // This is used if user updates their password when they are already logged in
  // and no email reset link is required
  const { id, mmid, email, current_password, new_password } = req.body
  try {
    const mmAuthRes = await axios.post(`${mattermostUrl}/users/login`, {
      login_id: email,
      password: current_password,
    })
    if (mmAuthRes && mmAuthRes.data && mmAuthRes.status == 200) {
      // User's current password was correct
      // Update node user password
      const user = await User.findOne({
        where: { id },
      })
      await user.update({
        password: bcrypt.hashSync(new_password, 12),
      })

      // Update mattermost user password
      axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
      await axios.put(`${mattermostUrl}/users/${mmid}/password`, {
        new_password,
        current_password,
      })

      res.status(200).send({
        success: true,
        message: 'Password changed succesfully',
      })
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Changing password failed',
      error: e.message,
    })
  }
}

export const reset = async (req, res) => {
  const { uuid, password } = req.body

  try {
    // Check the token is still valid and if so update 'used' value
    // If the token is not valid, throw an error
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
    axios.defaults.headers.common.Authorization = `Bearer ${process.env.MASTER_TOKEN}`
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
      error: err.message,
    })
  }
}
