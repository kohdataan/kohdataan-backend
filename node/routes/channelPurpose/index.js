import express from 'express'
import passport from 'passport'
import * as channelPurposeCtrl from '../../controllers/channelPurpose/index.js'

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
router.patch(
  '/resetAllChannels',
  channelPurposeCtrl.resetPurposeForAllChannels
)

export default router
