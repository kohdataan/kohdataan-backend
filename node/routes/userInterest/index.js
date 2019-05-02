import express from 'express'
import * as userInterestCtrl from '../../controllers/userInterest'

const router = express.Router()

router.get('/', userInterestCtrl.getUserInterests)

router.post('/', userInterestCtrl.addUserInterest)

router.get('/:id', userInterestCtrl.getUserInterest)

router.put('/:id', userInterestCtrl.updateUserInterest)

router.delete('/:id', userInterestCtrl.deleteUserInterest)

export default router
