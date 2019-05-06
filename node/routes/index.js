import express from 'express'
import channel from './channel'
import channelInvitation from './channelInvitation'
import interest from './interest'
import question from './question'
import user from './user'
import userInterest from './userInterest'
import userQuestion from './userQuestion'
import auth from './auth'

const router = express.Router()

router.use('/channel', channel)
router.use('/channelInvitation', channelInvitation)
router.use('/interest', interest)
router.use('/question', question)
router.use('/user', user)
router.use('/userInterest', userInterest)
router.use('/userQuestion', userQuestion)
router.use('/auth', auth)

export default router
