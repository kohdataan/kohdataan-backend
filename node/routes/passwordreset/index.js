import express from 'express'
import * as passwordResetCtrl from '../../controllers/passwordreset'

const router = express.Router()

router.post('/', passwordResetCtrl.handlePasswordResetRequest)
router.patch('/', passwordResetCtrl.handlePasswordReset)

export default router
