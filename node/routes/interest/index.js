const express = require('express');
const router = express.Router();
const interestCtrl = require('../../controllers/interest');


router.get('/', interestCtrl.getInterests);

router.post('/', interestCtrl.addInterest);

router.get('/:id', interestCtrl.getInterest);

router.put('/:id', interestCtrl.updateInterest);

router.delete('/:id', interestCtrl.deleteInterest);

module.exports = router;
