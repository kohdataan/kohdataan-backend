import db from '../models'

const ExtractJWT = require('passport-jwt').ExtractJwt

// The model here is retrieved through db because this way vscode knows they are sequelize models.
const LogoutToken = db.sequelize.model('LogoutToken')

export default (req, res, next) => {
  const jwtToken = ExtractJWT.fromAuthHeaderAsBearerToken()(req)

  // If call does not have a token, just call next
  if (!jwtToken) {
    return next()
  }

  LogoutToken.findOne({ where: { token: jwtToken } })
    .then(token => {
      // If token is not found, call next as it has not been logged out with
      if (!token) {
        return next()
      }

      // If token is found, respond with 401 as the token was logged out with (also do not call next())
      return res.status(401).send({
        success: false,
        message: 'You have logged out',
        error: 'This jwt token has been logged out with',
      })
    })
    .catch(err => {
      return res.status(500).send({
        success: false,
        message: 'Something went wrong',
        error: err,
      })
    })
}
