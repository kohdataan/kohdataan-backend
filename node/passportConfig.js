import bcrypt from 'bcrypt'
import model from './models/index.js'

const { User } = model

import passport from 'passport'
import passportLocal from 'passport-local'
import passportJwt from 'passport-jwt'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJwt.Strategy
const ExtractJWT = passportJwt.ExtractJwt

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
      return User.findOne({
        where: {
          id: jwtPayload.id,
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
