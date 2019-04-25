import express from 'express'
import * as interestCtrl from '../../controllers/interest'

const router = express.Router()

router.get('/', interestCtrl.getInterests)

router.post('/', interestCtrl.addInterest)

router.get('/:id', interestCtrl.getInterest)

router.put('/:id', interestCtrl.updateInterest)

router.delete('/:id', interestCtrl.deleteInterest)

export default router
