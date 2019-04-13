const express = require('express');
const router = express.Router();
const channelInvitationCtrl = require('../../controllers/channel-invitation');


router.get('/', channelInvitationCtrl.getChannelInvitations);

router.post('/', channelInvitationCtrl.addChannelInvitation);

router.get('/:id', channelInvitationCtrl.getChannelInvitation);

router.put('/:id', channelInvitationCtrl.updateChannelInvitation);

router.delete('/:id', channelInvitationCtrl.deleteChannelInvitation);

module.exports = router;
