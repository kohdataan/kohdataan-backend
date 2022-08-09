import express from 'express'
import * as channelCtrl from '../../controllers/channel/index.js'

const router = express.Router()

router.post('/sendImageToChannel', channelCtrl.sendImageToChannel)

router.post('/sendAudioToChannel', channelCtrl.sendAudioToChannel)

router.post('/leaveChannel', channelCtrl.leaveChannel)

router.get('/members/:id', channelCtrl.getChannelUsers)

export default router
