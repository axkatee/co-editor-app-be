const socketIo = require('socket.io');

const socketServer = (http) => {
    const io = socketIo(http, {
        cors: {}
    });

    io.on('connection', (socket) => {
        socket.on('setDataAboutConversation', (data) => {
            socket.broadcast.emit('setDataAboutConversation', data);
        });
        socket.on('deleteConversation', (data) => {
            socket.broadcast.emit('deleteConversation', data);
        });
    });
}

module.exports = socketServer;