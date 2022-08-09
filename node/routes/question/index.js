import express from 'express'
import * as questionCtrl from '../../controllers/question/index.js'

const router = express.Router()

router.get('/', questionCtrl.getQuestions)

router.post('/', questionCtrl.addQuestion)

router.get('/:id', questionCtrl.getQuestion)

router.put('/:id', questionCtrl.updateQuestion)

router.delete('/:id', questionCtrl.deleteQuestion)

export default router
