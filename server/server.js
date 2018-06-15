/**
 * Server module
 */
const express = require('express');
const config = require('./config');
const broker = require('./models/broker');
const cache = require('./models/cache');
const path = require("path");
const fs = require('fs');

// initialize express
const app = express();


const credentials = {
    key: fs.readFileSync(path.join(__dirname , '../certificates/key.pem')),
    cert: fs.readFileSync(path.join(__dirname , '../certificates/cert.pem')),
};
const server = require('https').Server(credentials, app);
// sockets that will handle the signaling between the clients
const io = require('socket.io')(server);

// server the client static files
app.use(express.static('client'));

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../../client/index.html'));
});

// port
const PORT = config.PORT;
server.listen(PORT, () => console.log(`Server up and running on Port: ${PORT}`));

// let the broker handle the sockets
broker(io, cache);
