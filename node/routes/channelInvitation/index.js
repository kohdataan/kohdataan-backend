import express from 'express'
import * as channelInvitationCtrl from '../../controllers/channelInvitation'

const router = express.Router()

router.get('/', channelInvitationCtrl.getChannelInvitations)

router.post('/', channelInvitationCtrl.addChannelInvitation)

router.get('/:id', channelInvitationCtrl.getChannelInvitation)

router.put('/:id', channelInvitationCtrl.updateChannelInvitation)

router.delete('/:id', channelInvitationCtrl.deleteChannelInvitation)

export default router
