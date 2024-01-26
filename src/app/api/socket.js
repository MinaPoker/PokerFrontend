import { Server } from 'socket.io';

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, { path: "/api/socketio" });

        io.on('connection', (socket) => {
            console.log('A user connected', socket.id);

            socket.on('invitePlayer', (data) => {
                io.to(data.playerBId).emit('invitePlayer', {
                    gameId: data.gameId,
                    inviterId: socket.id,
                });
            });

        });

        res.socket.server.io = io;
    }
    res.end();
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default ioHandler;
