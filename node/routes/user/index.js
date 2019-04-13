const express = require('express');
const router = express.Router();
const userCtrl = require('../../controllers/user');


router.get('/', userCtrl.getUsers);

router.post('/', userCtrl.addUser);

router.get('/:id', userCtrl.getUser);

router.put('/:id', userCtrl.updateUser);

router.delete('/:id', userCtrl.deleteUser);

module.exports = router;
