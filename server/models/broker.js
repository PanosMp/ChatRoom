/**
 * Broker module
 * @param {*} io 
 * @param {*} cache 
 */
const UserModel = require('./user');
module.exports = (io, cache) => {
    // on new connection
    io.on('connection', (socket) => {
        // get socket id
        let socketId = socket.id;
        // if exists should return the cached room Id
        let cachedEntry = cache.get(socketId);
        let user = cachedEntry ||  UserModel(socketId);

        // join room event
        socket.on('join', (roomId) => {
            // join socket io room
            socket.join(roomId);
            // update user instance 
            user.roomId = roomId;
            // push in cache
            cache.update(socketId, user);
            // log
            console.info(`User with socket id: ${socketId} entered room: ${roomId}`);
            socket.emit('joined', roomId);
        });
    
        // leave room event
        socket.on('leave', (roomId) => {
            // leave room
            socket.leave(roomId);
            // update user instance
            user.roomId = null;
            // update cache
            cache.update(socketId, user);
            // log 
            console.info(`User with socket id: ${socketId} left room: ${roomId}`);
            socket.emit('left_room', roomId);
        });

        // on message push to all clients in room
        socket.on('message', (message, roomId) => {
            socket.to(roomId).emit(message);
        });

        // on disconnect
        socket.on('disconnect', () => {
            // if was in a room inform users
            if (user && user.roomId) {
                socket.to(user.roomId).emit('user_left');
            }
            cache.remove(socketId);
            console.info(`User with socket id: ${socketId} disconnected`);
        });

        // emit that socket ready
        socket.emit('ready');
    });
};