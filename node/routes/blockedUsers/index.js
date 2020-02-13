import express from 'express'
import passport from 'passport'
import * as blockedUsersCtrl from '../../controllers/blockedUsers'

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt'),
  blockedUsersCtrl.handleBlockingUser
)

router.delete(
  '/',
  passport.authenticate('jwt'),
  blockedUsersCtrl.handleUnblockingUser
)

export default router
