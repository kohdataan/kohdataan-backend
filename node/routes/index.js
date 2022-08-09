import express from 'express'
import channel from './channel/index.js'
import channelInvitation from './channelInvitation/index.js'
import interest from './interest/index.js'
import location from './location/index.js'
import question from './question/index.js'
import user from './user/index.js'
import userInterest from './userInterest/index.js'
import userQuestion from './userQuestion/index.js'
import auth from './auth/index.js'
import sendMail from './sendmail/index.js'
import channelPurpose from './channelPurpose/index.js'
import emailVerification from './emailVerification/index.js'
import blockedUsers from './blockedUsers/index.js'

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
router.use('/emailVerification', emailVerification)
router.use('/sendMail', sendMail)
router.use('/channelPurpose', channelPurpose)
router.use('/blockUser', blockedUsers)

export default router
