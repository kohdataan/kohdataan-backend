import express from 'express'
import passport from 'passport'
import * as authCtrl from '../../controllers/auth'

const router = express.Router()

router.post('/login', authCtrl.login)

router.post('/logout', authCtrl.logout)

router.post('/forgot', authCtrl.forgot)

router.post('/reset', authCtrl.reset)

export default router
