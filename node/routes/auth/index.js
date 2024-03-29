import express from 'express'
import * as authCtrl from '../../controllers/auth/index.js'

const router = express.Router()

router.post('/login', authCtrl.login)

router.post('/logout', authCtrl.logout)

router.post('/forgot', authCtrl.forgot)

router.post('/reset', authCtrl.reset)

router.post('/check-resetlink', authCtrl.checkIfResetUsed)

router.post('/update-password', authCtrl.updatePassword)

export default router
