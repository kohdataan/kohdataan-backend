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

export const forgot = (req, res) => {
  res.status(501).send('not yet implemented')
}

export const reset = (req, res) => {
  res.status(501).send('not yet implemented')
}
