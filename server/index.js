const { Server } = require("socket.io");
const httpServer = require("http").createServer();

const tournaments = new Map();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // or your Next.js app URL
        methods: ["GET", "POST"],
    },
});

const gameSessions = {}; // Store session data

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('joinTournament', (tournamentId, playerData) => {
        // Get the tournament data or create a new one if it doesn't exist
        let tournament = tournaments.get(tournamentId) || {
            id: tournamentId,
            players: [],
            gameState: {}
        };

        tournament.players.push({ id: socket.id, ...playerData });

        tournaments.set(tournamentId, tournament);

        // Broadcast the updated player list to other players in the same tournament
        socket.broadcast.to(tournamentId).emit('playerJoined', playerData);

        // Join the tournament room
        socket.join(tournamentId);
    });

    socket.on('createSession', async (userId) => {
        const sessionId = generateUniqueSessionId();
        gameSessions[sessionId] = { players: [userId], /* Other session data */ };

        socket.join(sessionId); // Join the socket room
        socket.emit('sessionCreated', sessionId);
    });



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