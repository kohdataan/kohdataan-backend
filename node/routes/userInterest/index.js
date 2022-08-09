import express from 'express'
import passport from 'passport'
import * as userInterestCtrl from '../../controllers/userInterest/index.js'

const router = express.Router()

router.get('/', passport.authenticate('jwt'), userInterestCtrl.getUserInterests)

router.post(
  '/',
  passport.authenticate('jwt'),
  userInterestCtrl.addUserInterests
)

router.get(
  '/:username',
  passport.authenticate('jwt'),
  userInterestCtrl.getUserInterest
)

router.put(
  '/:id',
  passport.authenticate('jwt'),
  userInterestCtrl.updateUserInterest
)

router.delete(
  '/:id',
  passport.authenticate('jwt'),
  userInterestCtrl.deleteUserInterest
)

export default router
