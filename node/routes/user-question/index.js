const express = require('express');
const router = express.Router();
const userQuestionCtrl = require('../../controllers/user-question');


router.get('/', userQuestionCtrl.getUserQuestions);

router.post('/', userQuestionCtrl.addUserQuestion);

router.get('/:id', userQuestionCtrl.getUserQuestion);

router.put('/:id', userQuestionCtrl.updateUserQuestion);

router.delete('/:id', userQuestionCtrl.deleteUserQuestion);

module.exports = router;
