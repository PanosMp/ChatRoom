/**
 * User model
 */
const uuid = require('uuid');
module.exports = (socketId, username = 'Anonymous') => {
    this._id = uuid.v1();
    this.socketId = socketId;
    this.username = username;
    this.roomId;

    return {
        id: this._id, 
        socketId: this.socketId,
        username: this.username,
        roomId: this.roomId,
    };
}