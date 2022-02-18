const express = require('express');
const router = express.Router();

const conversationCtrl = require('../controllers/conversation_ctrl');

router.get('/', conversationCtrl.getConversations);
router.post('/', conversationCtrl.createConversation);
router.post('/mutations', conversationCtrl.editConversation);
router.delete('/', conversationCtrl.deleteConversation);
router.get('/info', conversationCtrl.getInfoAboutConversation);
router.post('/user/add', conversationCtrl.addUserToConversation);
router.post('/favorite', conversationCtrl.changeFavoriteState);

module.exports = router;