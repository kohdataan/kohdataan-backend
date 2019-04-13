const express = require('express');
const router = express.Router();
const userInterestCtrl = require('../../controllers/user-interest');


router.get('/', userInterestCtrl.getUserInterests);

router.post('/', userInterestCtrl.addUserInterest);

router.get('/:id', userInterestCtrl.getUserInterest);

router.put('/:id', userInterestCtrl.updateUserInterest);

router.delete('/:id', userInterestCtrl.deleteUserInterest);

module.exports = router;
