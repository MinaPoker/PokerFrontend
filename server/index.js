const { Server } = require("socket.io");
const httpServer = require("http").createServer();
import { generateUniquePokerId } from '../src/util/index'

const tournaments = new Map();

// Example tournament data structure
// const tournamentData = {
//     id: 'tournament123',
//     players: [
//       { id: 'player1', name: 'John Doe' },
//       { id: 'player2', name: 'Jane Smith' },
//     ],
//     gameState: {
//     }
//   };

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // or your Next.js app URL
        methods: ["GET", "POST"],
    },
});

const gameSessions = {}; // Store session data

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('createTournament', (playerData) => {
        const tournamentId = generateUniquePokerId(); // Generate a unique tournament ID
        const invitationChannel = `tournament-invitation-${tournamentId}`;

        // Create a new tournament object and store it in the tournaments map
        const tournament = {
            id: tournamentId,
            players: [{ id: socket.id, ...playerData }],
            gameState: {},
            invitationChannel
        };
        tournaments.set(tournamentId, tournament);

        // Join the invitation channel
        socket.join(invitationChannel);
    });

    // for invited players
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

    socket.on('disconnect', (tournamentId) => {
        // const tournament = Array.from(tournaments.values()).find(t =>
        //     t.players.some(p => p.id === socket.id)
        // );

        const tournament = tournaments.get(tournamentId);

        if (tournament) {
            // Remove the player from the tournament
            tournament.players = tournament.players.filter(p => p.id !== socket.id);

            tournaments.set(tournament.id, tournament);

            // Broadcast the updated player list to other players in the same tournament
            socket.broadcast.to(tournament.id).emit('playerLeft', socket.id);
        }
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

});

const PORT = process.env.PORT || 5005;
httpServer.listen(PORT, () => console.log(`Socket.IO server running on port http://localhost:${PORT}`));