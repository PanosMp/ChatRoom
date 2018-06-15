/**
 * Connection url
 */
module.exports = () => {
    this.host = "https://localhost:3000";
    this.socket = io.connect(this.host);

    // on socket ready
    this.socket.on('ready', (data) => {
        console.log("Socket connected");
    });

    return this.socket;
 }