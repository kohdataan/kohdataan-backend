import express from 'express'
import * as channelPurposeCtrl from '../../controllers/channelPurpose'

const router = express.Router()

router.patch('/reset', channelPurposeCtrl.resetChannelPurpose)
router.patch('/addUser', channelPurposeCtrl.addUserInterestsToPurpose)
router.patch('/removeUser', channelPurposeCtrl.removeUserInterestsFromPurpose)

export default router
