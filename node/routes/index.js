import express from 'express'
import channel from './channel'
import channelInvitation from './channelInvitation'
import interest from './interest'
import location from './location'
import question from './question'
import user from './user'
import userInterest from './userInterest'
import userQuestion from './userQuestion'
import auth from './auth'
<<<<<<< HEAD
import passwordReset from './passwordreset'
import emailVerification from './emailverification'
=======
import sendMail from './sendMail'
>>>>>>> master

const router = express.Router()

router.use('/channel', channel)
router.use('/channelInvitation', channelInvitation)
router.use('/interest', interest)
router.use('/location', location)
router.use('/question', question)
router.use('/user', user)
router.use('/userInterest', userInterest)
router.use('/userQuestion', userQuestion)
router.use('/auth', auth)
<<<<<<< HEAD
router.use('/passwordReset', passwordReset)
router.use('/emailverification', emailVerification)
=======
router.use('/sendMail', sendMail)
>>>>>>> master

export default router
