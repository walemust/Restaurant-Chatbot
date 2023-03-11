const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Restaurant Bot';

//Run when client connects
io.on('connect', socket => {
    console.log('New customer connected...');
    //Welcome current customer
    socket.emit('message', formatMessage(botName, 'Welcome to the RestaurantOrderBot!'));

    //Broadcast when a customer connects
    socket.broadcast.emit('message', formatMessage(botName, 'A customer has connected'));

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A customer has disconnected'));
    });

    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
});