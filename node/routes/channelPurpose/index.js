import express from 'express'
import passport from 'passport'
import * as channelPurposeCtrl from '../../controllers/channelPurpose'

const router = express.Router()

router.patch(
  '/resetUserChannels',
  passport.authenticate('jwt'),
  channelPurposeCtrl.resetUserChannelsPurpose
)
router.patch(
  '/addUser/:channelId',
  passport.authenticate('jwt'),
  channelPurposeCtrl.addUserInterestsToPurpose
)
router.patch(
  '/removeUser/:channelId',
  passport.authenticate('jwt'),
  channelPurposeCtrl.removeUserInterestsFromPurpose
)

export default router
