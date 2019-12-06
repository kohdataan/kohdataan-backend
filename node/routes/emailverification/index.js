import express from 'express'
import * as emailVerification from '../../controllers/emailverification'

const router = express.Router()

router.post('/', emailVerification.handleEmailVerificationRequest)

export default router
