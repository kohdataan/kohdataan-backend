import express from 'express'
import * as userQuestionCtrl from '../../controllers/userQuestion/index.js'

const router = express.Router()

router.get('/', userQuestionCtrl.getUserQuestions)

router.post('/', userQuestionCtrl.addUserQuestion)

router.get('/:id', userQuestionCtrl.getUserQuestion)

router.put('/:id', userQuestionCtrl.updateUserQuestion)

router.delete('/:id', userQuestionCtrl.deleteUserQuestion)

export default router
