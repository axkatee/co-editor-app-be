const express = require('express');
const router = express.Router();

const conversationCtrl = require('../controllers/conversation_ctrl');

router.get('/', conversationCtrl.getConversations);
router.post('/', conversationCtrl.createConversation);
router.patch('/mutations', conversationCtrl.editConversation);
router.delete('/', conversationCtrl.deleteConversation);
router.get('/info', conversationCtrl.getInfoAboutConversation);
router.patch('/invite', conversationCtrl.addUserToConversation);
router.patch('/favorite', conversationCtrl.changeFavoriteState);

module.exports = router;