import passport from 'passport'
import jwt from 'jsonwebtoken'

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
  res.status(501).send('not yet implemented')
}

export const reset = (req, res) => {
  res.status(501).send('not yet implemented')
}
