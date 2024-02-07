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

    // when new tournament started
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

    // send invitation to players
    socket.on('invitePlayers', (tournamentId, invitedPlayers) => {
        const tournament = tournaments.get(tournamentId);
        if (tournament) {
            const invitationChannel = tournament.invitationChannel;

            invitedPlayers.forEach(invitedPlayer => {
                io.to(invitedPlayer.id).emit('tournamentInvitation', {
                    tournamentId,
                    invitedBy: socket.id,
                    invitationChannel
                });
            });
        }
    });

    socket.on('tournamentInvitation', ({ tournamentId, invitedBy, invitationChannel }) => {
        // Display the invitation to the user (UI) & Get the user's response (accept or decline) - pending

        socket.join(invitationChannel);

        // Respond to the invitation
        if (response === 'accept') {
            socket.to(invitationChannel).emit('invitationResponse', {
                tournamentId,
                invitedBy,
                invitee: socket.id,
                accepted: true
            });
        } else {
            socket.to(invitationChannel).emit('invitationResponse', {
                tournamentId,
                invitedBy,
                invitee: socket.id,
                accepted: false
            });
        }
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