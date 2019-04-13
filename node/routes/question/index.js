const express = require('express');
const router = express.Router();
const questionCtrl = require('../../controllers/question');


router.get('/', questionCtrl.getQuestions);

router.post('/', questionCtrl.addQuestion);

router.get('/:id', questionCtrl.getQuestion);

router.put('/:id', questionCtrl.updateQuestion);

router.delete('/:id', questionCtrl.deleteQuestion);

module.exports = router;
