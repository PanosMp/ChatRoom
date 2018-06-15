/**
 * App controller
 */
const templates = require('../templates/templates');
const render = require('./helpers').render;
const compile = require('./helpers').compile;

module.exports = (socket, peerConnection) => {
    // load home page

    this.loadHomepage = () => {
        console.log(`Rendering home page`);
        render(templates.home, {}, true);
    };

    // join chat room
    this.joinChatRoom = (room) => {
        console.log('Request user media');

        // request camera and mic
        const constraints = {
            video: true,
            audio: true,
        };

        // if browser supports the navigator api
        if(navigator.mediaDevices.getUserMedia) {
            navigator
                .mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    // render the room template
                    render(templates.room_header, {room_name: room}, true);
                    render(templates.video);
                    this.loadVideo('localVideo', stream);

                    console.log(`Joining room: ${room}`);
                    socket.emit('join', room);
                })
                .catch(e => {
                    console.log("Error occured");
                    console.log(e);
                });
        } else {
            alert('Your browser does not support getUserMedia API');
        }
    };

    // load video on the element provided the id
    this.loadVideo = (id, stream) => {
        window.localStream = stream;
        document.getElementById(id).srcObject = stream;
    }

    this.waitOffer = () => {
        let p = new RTCPeerConnection({
            'iceServers': [
                {'urls': 'stun:stun.stunprotocol.org:3478'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        });

        peerConnection = p;
        // set up on candidate listener
        peerConnection.onicecandidate = this.gotCandidate;

        // set up on remove track listener
        peerConnection.ontrack = this.gotRemoteStream;
        peerConnection.addStream(window.localStream);
    }

    // make offer
    this.makeOffer = () => {
        let p = new RTCPeerConnection({
            'iceServers': [
                {'urls': 'stun:stun.stunprotocol.org:3478'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        });

        peerConnection = p;
        // set up on candidate listener
        peerConnection.onicecandidate = this.gotCandidate;

        // set up on remove track listener
        peerConnection.ontrack = this.gotRemoteStream;
        peerConnection.addStream(window.localStream);

        //create offer and add local description on success
        peerConnection
            .createOffer()
            .then(desc => {
                this.setLocalDescription(desc);
            })
            .catch(err => {
                console.log("Error creating offer");
                console.log(err);
            });
    }

    // got remote stream 
    this.gotRemoteStream = (event) => {
        this.loadVideo('remoteVideo', event.streams[0]);
    }

    // on new candidate
    this.gotCandidate = (event) => {
        if (!event.candidate) {
            return;
        }
        // pass candidate
        socket.emit('message', {
            type: "ice",
            payload: {'ice': event.candidate},
        });
    }

    // add new candidate
    this.addCandidate = (ice) => {
        console.log("Will add candidate");
        console.log(ice);
        peerConnection.addIceCandidate(new RTCIceCandidate(ice))
        .catch(err => {
            console.log("Error adding candidate.");
            console.log(err);
        });
    }

    // set local description
    this.setLocalDescription = (description) => {
        console.log("Setting local description.");
        peerConnection.setLocalDescription(description).then(function() {
                socket.emit('message', {
                type: "sdp",
                payload: {'sdp': peerConnection.localDescription},
            });
        }).catch(err => {
            console.log("Error setting local description.");
            console.log(err);
        });
    }

    // set remote description
    this.setRemoteDescription = (sdp) => {
        console.log("Setting remote description.");
        peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
            .then(() => {
            // Only create answers in response to offers
            if(sdp.type == 'offer') {
                this.createAnswer();
            }
          }).catch(err => {
              console.log("Error setting remote description.");
              console.log(err);
          });      
    }

    // create answer
    this.createAnswer = () => {
        console.log("Creating answer.");
        peerConnection.createAnswer()
            .then(this.setLocalDescription)
            .catch(err => {
                console.log("Error creating answer.");
                console.log(err);
            });
    }

    return this;
};