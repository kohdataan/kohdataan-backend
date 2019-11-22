import bcrypt from 'bcrypt'
import model from './models'

const { User, LogoutToken } = model

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
    (email, password, cb) => {
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
          return bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              return cb(null, false, {
                message: 'passwords do not match',
              })
            }
            return cb(null, user)
          })
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
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, cb) => {
      console.log(jwtPayload)
      return User.findOne({
        where: {
          id: jwtPayload.user.id,
        },
      })
        .then(user => {
          return cb(null, user)
        })
        .catch(err => {
          return cb(err)
        })
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
