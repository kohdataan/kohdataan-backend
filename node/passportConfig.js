import bcrypt from 'bcrypt'
import model from './models'

const { User } = model

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function(email, password, cb) {
      // Assume there is a DB module pproviding a global UserModel
      return User.findOne({
        where: {
          email,
        },
      })
        .then(user => {
          if (!user) {
            return cb(null, false, {
              message: 'Incorrect email or password.',
            })
          }
          bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              console.log('passwords do not match')
              return cb(null, false, {
                message: 'passwords do not match',
              })
            }
            console.log('user found & authenticated')
            // note the return needed with passport local - remove this return for passport JWT
            return cb(null, user)
          })
          return cb(null, false)
        })
        .catch(err => {
          return cb(err)
        })
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    function(jwtPayload, cb) {
      console.log(jwtPayload)
      // find the user in db if needed
      return User.findOne({
        where: {
          id: jwtPayload.id,
        },
      })
        .then(user => {
          return cb(null, {
            id: user.id,
            email: user.email,
            username: user.username,
          })
        })
        .catch(err => {
          return cb(err)
        })
    }
  )
)

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})
