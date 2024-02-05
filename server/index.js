// const { createServer } = require('http');
// const { Server } = require('socket.io');

// const httpServer = createServer();
// const io = new Server(httpServer, { path: '/api/socketio' });
const { Server } = require("socket.io");
const httpServer = require("http").createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // or your Next.js app URL
        methods: ["GET", "POST"],
    },
});


io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('invitePlayer', (data) => {
        io.to(data.playerBId).emit('invitePlayer', {
            gameId: data.gameId,
            inviterId: socket.id,
        });
    });

    socket.on("message", (data) => {
        console.log(data);
        socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    // ... other socket event handlers ...
});

const PORT = process.env.PORT || 5005;
httpServer.listen(PORT, () => console.log(`Socket.IO server running on port http://localhost:${PORT}`));