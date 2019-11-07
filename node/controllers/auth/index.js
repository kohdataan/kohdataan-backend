import passport from 'passport'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'
import model from '../../models'

const { PasswordResetUuid, User } = model

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

export const forgot = (req, res) => {
  const { email } = req.body

  return User.findOne({ where: { email } })
    .then(user => {
      return PasswordResetUuid.create({ userId: user.id })
        .then(() => {
          return res.status(201).send({
            success: true,
            message: 'Email found and uuid generated and stored',
          })
        })
        .catch(err => {
          return res.status(500).send({
            success: false,
            message: 'Cannot create database entry',
            error: err,
          })
        })
    })
    .catch(err => {
      return res.status(500).send({
        success: false,
        message: 'Email not found',
        error: err,
      })
    })
}

// Non completed template for handling password reset
export const reset = (req, res) => {
  const { uuid, password } = req.body

  return PasswordResetUuid.findOne({ where: { uuid } })
    .then(passwordResetEntry => {
      const givenTime = Number(process.env.PASSWORD_RESET_TIME)
      const currentTime = new Date().getTime()
      const tokenTime = passwordResetEntry.createdAt.getTime()
      if (currentTime - tokenTime < givenTime) {
        return User.findOne({ where: { id: passwordResetEntry.userId } })
          .then(user => {
            passwordResetEntry.destroy()
            return res.status(200).send({
              success: true,
              message: 'Found',
            })
          })
          .catch(err => {
            return res.status(500).send({
              success: false,
              message: 'There was a problem fetching associated user',
              error: err,
            })
          })
      }
      passwordResetEntry.destroy()
      return res.status(500).send({
        success: false,
        message: 'Password reset token has expired',
      })
    })
    .catch(err => {
      return res.status(500).send({
        success: false,
        message: 'Given uuid does not match any stored uuids',
        error: err,
      })
    })
}
