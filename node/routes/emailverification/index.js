import express from 'express'
import * as emailVerification from '../../controllers/emailverification'

const router = express.Router()

router.post('/req', emailVerification.handleEmailVerificationRequest)
router.post('/ver', emailVerification.handleEmailVerification)

export default router
