import express from 'express'
import passport from 'passport'
import * as channelPurposeCtrl from '../../controllers/channelPurpose'

const router = express.Router()

// This one is for resetting channel purpose if anything ever goes wrong
router.patch(
  '/reset:channelId',
  passport.authenticate('jwt'),
  channelPurposeCtrl.resetChannelPurpose
)
router.patch(
  passport.authenticate('jwt'),
  '/addUser/:channelId',
  channelPurposeCtrl.addUserInterestsToPurpose
)
router.patch(
  passport.authenticate('jwt'),
  '/removeUser:channelId',
  channelPurposeCtrl.removeUserInterestsFromPurpose
)

export default router
