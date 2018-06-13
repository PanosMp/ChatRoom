
/**
 * Server module
 */
const express = require('express');
const config = require('./config');
const broker = require('./models/broker');
const cache = require('./models/cache');
const path = require("path");

// initialize express
const app = express();
const server = require('http').Server(app);
// sockets that will handle the signaling between the clients
const io = require('socket.io')(server);

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../../client/index.html'));
});

app.get('/socket.io', (req, res) => {
    res.sendFile(path.join(__dirname + '/models/socketio.js'));
});

// port
const PORT = config.PORT;
server.listen(PORT, () => console.log(`Server up and running on Port: ${PORT}`));

// let the broker handle the sockets
broker(io, cache);
