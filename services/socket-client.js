const io = require('socket.io-client');
const port = process.env.PORT || 3000;
const serverAddress = `http://localhost:${port}`
const shadowClient = io(serverAddress);

const sendConversationsData = (conversations) => {
    shadowClient.emit('setDataToConversations', conversations);
};

module.exports = {
    sendConversationsData
}