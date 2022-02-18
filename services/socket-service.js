const socketIo = require('socket.io');
const isEqual = require('lodash.isequal');

const socketServer = (http) => {
    const io = socketIo(http, {
        cors: {}
    });
    const sockets = {};

    io.on('connection', (socket) => {
        socket.on('setDataToConversations', (data) => {
            socket.broadcast.emit('setDataToConversations', data);
        });

        socket.on('setUserSocketInfo', (id) => {
            sockets[id] = socket;
        });

        socket.on('removeUserSocketInfo', () => {
            for (const key in sockets) {
                if (sockets[key] && isEqual(sockets[key], socket)) {
                    delete sockets[key];
                }
            }
        })
    });
}

module.exports = socketServer;