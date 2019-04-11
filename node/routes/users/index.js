const express = require('express');
const router = express.Router();
const usersCtrl = require('../../controllers/users')


router.get('/', usersCtrl.getUsers);

module.exports = router;
