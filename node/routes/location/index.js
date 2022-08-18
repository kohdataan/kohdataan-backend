import express from 'express'
import passport from 'passport'
import * as locationCtrl from '../../controllers/location/index.js'

const router = express.Router()

router.get('/', passport.authenticate('jwt'), locationCtrl.getLocations)

export default router
