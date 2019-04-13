const express = require('express');
const router = express.Router();
const channelCtrl = require('../../controllers/channel');




router.post('/sendImageToChannel', channelCtrl.sendImageToChannel);

router.post('/sendAudioToChannel', channelCtrl.sendAudioToChannel);

router.post('/leaveChannel', channelCtrl.leaveChannel);


module.exports = router;
