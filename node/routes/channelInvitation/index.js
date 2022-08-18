import express from 'express'
import passport from 'passport'
import * as channelInvitationCtrl from '../../controllers/channelInvitation/index.js'

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt'),
  channelInvitationCtrl.getChannelInvitations
)

router.post('/', channelInvitationCtrl.addChannelInvitation)

router.get('/:id', channelInvitationCtrl.getChannelInvitation)

router.put('/:id', channelInvitationCtrl.updateChannelInvitation)

router.delete('/:id', channelInvitationCtrl.deleteChannelInvitation)

export default router
