const { Server } = require("socket.io");
const httpServer = require("http").createServer();
import { generateUniquePokerId } from '../src/util/index'

const tournaments = new Map();
// const tournamentData = {
//     id: 'gameId',
//     players: [
//       { id: 'address', name: 'John Doe' },
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
        const gameId = generateUniquePokerId(); // Generate a unique tournament ID
        const invitationChannel = `tournament-invitation-${gameId}`;

        // Create a new tournament object and store it in the tournaments map
        const tournament = {
            id: gameId,
            players: [{ id: socket.id, ...playerData }],
            gameState: {},
            invitationChannel
        };
        tournaments.set(gameId, tournament);

        // Join the invitation channel
        socket.join(invitationChannel);
    });

    // send invitation to players
    socket.on('invitePlayers', (gameId, invitedPlayers) => {
        const tournament = tournaments.get(gameId);
        if (tournament) {
            const invitationChannel = tournament.invitationChannel;

            invitedPlayers.forEach(invitedPlayer => {
                io.to(invitedPlayer.id).emit('tournamentInvitation', {
                    gameId,
                    invitedBy: socket.id,
                    invitationChannel
                });
            });
        }
    });

    // Handle invitation responses
    socket.on('tournamentInvitation', ({ gameId, invitedBy, invitationChannel }) => {
        // Display the invitation to the user (UI) & Get the user's response (accept or decline) - pending

        socket.join(invitationChannel);

        // Respond to the invitation
        if (response === 'accept') {
            socket.to(invitationChannel).emit('invitationResponse', {
                gameId,
                invitedBy,
                invitee: socket.id,
                accepted: true
            });
        } else {
            socket.to(invitationChannel).emit('invitationResponse', {
                gameId,
                invitedBy,
                invitee: socket.id,
                accepted: false
            });
        }
    });

    // Host Player response on invitation  
    socket.on('invitationResponse', ({ gameId, invitedBy, invitee, accepted }) => {
        const tournament = tournaments.get(gameId);
        if (tournament && tournament.players.some(p => p.id === invitedBy)) {
            if (accepted) {
                // Add the invitee to the tournament's player list
                tournament.players.push({ id: invitee });
                tournaments.set(gameId, tournament);

                io.to(gameId).emit('playerJoined', { id: invitee });
            } else {
                // Remove the declined invitee from the tournament's player list
                tournament.players = tournament.players.filter(p => p.id !== invitee);
                tournaments.set(gameId, tournament);

                io.to(gameId).emit('playerLeft', { id: invitee });
            }
        }
    });

    // when all players joined
    socket.on('startTournament', (gameId) => {
        const tournament = tournaments.get(gameId);
        if (tournament && tournament.players.length >= minimumPlayersRequired) {
            // Start the tournament - Broadcast the start event to all tournament participants
            io.to(gameId).emit('tournamentStarted', tournament.gameState);

            // Leave the invitation channel
            socket.leave(tournament.invitationChannel);
        }
    });

    // for invited players
    socket.on('joinTournament', (gameId, playerData) => {
        // Get the tournament data or create a new one if it doesn't exist
        let tournament = tournaments.get(gameId) || {
            id: gameId,
            players: [],
            gameState: {}
        };

        tournament.players.push({ id: socket.id, ...playerData });

        tournaments.set(gameId, tournament);

        // Broadcast the updated player list to other players in the same tournament
        socket.broadcast.to(gameId).emit('playerJoined', playerData);

        // Join the tournament room
        socket.join(gameId);
    });

    socket.on('disconnect', (gameId) => {
        // const tournament = Array.from(tournaments.values()).find(t =>
        //     t.players.some(p => p.id === socket.id)
        // );

        const tournament = tournaments.get(gameId);

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