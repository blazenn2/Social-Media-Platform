let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: "*",
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) throw new Error('Web-socket not initialized');
        return io;
    }
}