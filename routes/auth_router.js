const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth_ctrl');

router.get('/users', authCtrl.getUsers);
router.post('/', authCtrl.createUser);
router.post('/login', authCtrl.login);

module.exports = router;
