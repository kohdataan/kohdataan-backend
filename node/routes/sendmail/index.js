import express from 'express'
import * as mailCtrl from '../../controllers/sendMail/index.js'

const router = express.Router()

router.post('/problem', mailCtrl.sendMailToSupport)

export default router
