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
import sendMail from './sendMail'

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
router.use('/sendMail', sendMail)

export default router
