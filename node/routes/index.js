const express = require('express');
const router = express.Router();

router.use('/channel', require('./channel'))
router.use('/channelInvitation', require('./channel-invitation'))
router.use('/interest', require('./interest'));
router.use('/question', require('./question'));
router.use('/user', require('./user'));
router.use('/userInterest', require('./user-interest'));
router.use('/userQuestion', require('./user-question'));

module.exports = router;
