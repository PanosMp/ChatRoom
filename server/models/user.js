/**
 * User model
 */
const uuid = require('uuid');
module.exports = (socketId, username = 'Anonymous') => {
    // create unique uid  
    this._id = uuid.v1();
    // associate user with socket id
    this.socketId = socketId;
    // set username if given
    this.username = username;
    // the room id the user is in
    this.roomId;

    return {
        id: this._id, 
        socketId: this.socketId,
        username: this.username,
        roomId: this.roomId,
    };
}