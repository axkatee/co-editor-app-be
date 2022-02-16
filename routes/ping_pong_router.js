const express = require('express');
const router = express.Router();

const pingPongCtrl = require('../controllers/ping_pong_ctrl');

router.get('/', pingPongCtrl.ping);

module.exports = router;