const io = require('socket.io-client');
const port = process.env.PORT || 3000;
const serverAddress = `http://localhost:${port}`
const shadowClient = io(serverAddress);

const sendConversationData = (conversation) => {
    shadowClient.emit('setDataAboutConversation', conversation);
};

const deleteConversationData = (conversationId) => {
    shadowClient.emit('deleteConversation', conversationId);
};

module.exports = {
    sendConversationData,
    deleteConversationData
}