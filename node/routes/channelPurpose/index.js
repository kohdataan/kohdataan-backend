import express from 'express'
import * as channelPurposeCtrl from '../../controllers/channelPurpose'

const router = express.Router()

router.patch('/reset', channelPurposeCtrl.resetChannelPurpose)

export default router
