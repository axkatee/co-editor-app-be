const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth_ctrl');

router.post('/create', authCtrl.createUser);
router.post('/login', authCtrl.login);
router.get('/users', authCtrl.getUsers);

module.exports = router;