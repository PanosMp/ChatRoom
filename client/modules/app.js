/**
 * Entry point for application
 */
const controller = require('./controller');
const events = require('./events');
const socket = require('./connection');

console.log("Starting application...");
$(document).ready(() => {
    console.log("Document Ready...");
    // connect to socket
    const s = socket();
    // will store the peer connection
    let peerConnection;

    // initialize app controller
    const appController = controller(s, peerConnection);

    // set up event listeners
    events(s, appController);

    // load home page on start
    controller(s).loadHomepage();
});


