import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, { path: "/api/socketio" });

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
httpServer.listen(PORT, () => console.log(`Socket.IO server running on port localhost:${PORT}`));
// // const express = require('express');
// // const { Server } = require('socket.io');
// // const http = require('http');

// // const app = express();
// // const server = http.createServer(app);

// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// const { createNextServer } = require('next');
// const { Server } = require('socket.io');

// // const io = new Server(server, { path: "/api/socketio" });

// // import { createServer } from 'http';
// // import { Server } from 'socket.io';
// // import { createNextServer } from 'next';

// const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
// const server = createServer(nextApp.getRequestHandler());
// const io = new Server(server, { path: "/api/socketio" }); 

// io.on('connection', (socket) => {
//     console.log('Socket: New client connected', socket.id);
//     // Handle Socket.IO events here
// });

// //                                           
// io.on('connection', (socket) => {
//     socket.on(server.invitePlayer, (data) => {
//         // Lookup Player B's socket and emit an invitation
//         io.to(data.playerBId).emit(ServerEvents.InvitePlayer, {
//             gameId: data.gameId,
//             inviterId: socket.id,
//         });
//     });
// });

// //accepting invites
// io.on('connection', (socket) => {
//     socket.on(ClientEvents.InvitePlayer, (data) => {
//         // Lookup Player B's socket and emit an invitation
//         io.to(data.playerBId).emit(ServerEvents.InvitePlayer, {
//             gameId: data.gameId,
//             inviterId: socket.id,
//         });
//     });
// });



// // app.prepare().then(() => {
// //     createServer((req, res) => {
// //         const parsedUrl = parse(req.url, true);
// //         const { pathname, query } = parsedUrl;
// //         console.log("Socket server is prepared")
// //         if (pathname === '/api/socket') {
// //             console.log("socket running :", pathname, "parsed url:", parsedUrl)
// //             io.engine.handleRequest(req, res);
// //         }
// //         else {
// //             console.log("socket incorrect route :", pathname, parsedUrl)
// //             handle(req, res, parsedUrl);
// //         }
// //     }).listen(3003, (err) => {
// //         if (err) throw err;
// //         console.log('> Ready on http://localhost:3003');
// //     });
// // });

// // export const config = {
// //     api: {
// //         bodyParser: false, // Important for Socket.IO
// //     },
// // };

// // export default ioHandler;


// const PORT = process.env.PORT ||  5005;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
