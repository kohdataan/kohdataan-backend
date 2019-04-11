var express = require('express');
var router = express.Router();
var usersCtrl = require('../../controllers/users')


router.get('/', usersCtrl.getUsers);

module.exports = router;
