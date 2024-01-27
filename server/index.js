const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, { path: '/api/socketio' });

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('invitePlayer', (data) => {
        io.to(data.playerBId).emit('invitePlayer', {
            gameId: data.gameId,
            inviterId: socket.id,
        });
    });

    // ... other socket event handlers ...
});

const PORT = process.env.PORT ||  5005;
httpServer.listen(PORT, () => console.log(`Socket.IO server running on port http://localhost:${PORT}`));