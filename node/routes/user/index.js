import express from 'express'
import passport from 'passport'
import * as userCtrl from '../../controllers/user'

const router = express.Router()

router.get('/', passport.authenticate('jwt'), userCtrl.getUsers)

router.post('/', userCtrl.addUser)

router.get('/:id', userCtrl.getUser)

router.put('/:id', userCtrl.updateUser)

router.delete('/:id', userCtrl.deleteUser)

export default router
