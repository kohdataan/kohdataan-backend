import express from 'express'
import * as mailCtrl from '../../controllers/mailsender'

const router = express.Router()

router.post('/problem', mailCtrl.mailFromRegProb)

export default router
