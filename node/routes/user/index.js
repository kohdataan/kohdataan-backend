import express from 'express'
import * as userCtrl from '../../controllers/user'

const router = express.Router()

router.get('/', userCtrl.getUsers)

router.post('/', userCtrl.addUser)

router.get('/:id', userCtrl.getUser)

router.put('/:id', userCtrl.updateUser)

router.delete('/:id', userCtrl.deleteUser)

export default router
