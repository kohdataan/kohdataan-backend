import passport from 'passport'
import jwt from 'jsonwebtoken'
import db from '../../models'

// The models here are retrieved through db because this way vscode knows they are sequelize models.

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

  /*
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
    */
}

export const forgot = (req, res) => {
  res.status(501).send('not yet implemented')
}

export const reset = (req, res) => {
  res.status(501).send('not yet implemented')
}
