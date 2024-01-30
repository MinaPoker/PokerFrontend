
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const FriendRequest = require('./models/friendRequestModel'); // Ensure this path is correct

// Replace the following with your MongoDB connection string
mongoose.connect('mongodb://localhost/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        socket.userId = username; // This should be the user's unique identifier, such as a user ID
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    });

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    // Friend request event handling
    socket.on('send_friend_request', function(data) {
        const newRequest = new FriendRequest({ sender: socket.userId, receiver: data.receiver });
        newRequest.save()
            .then(() => {
                io.to(data.receiverSocketId).emit('friend_request_received', { from: socket.userId });
            })
            .catch(err => {
                console.error(err);
            });
    });

    // Add similar event listeners for accepting and rejecting friend requests
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});
