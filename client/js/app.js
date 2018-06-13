$(document).ready(() => {
    var socket = io.connect('http://localhost:3000');
    socket.on('ready', function (data) {
        console.log('hello');
        socket.emit('join', '212c2c2c');
    });
});