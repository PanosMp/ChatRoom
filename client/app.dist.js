(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
    // dispatcher => apply animation on selector
    dispatch: (selector, animation) => {
        let animationClass = `${animation}`;
        if (selector.hasClass(animationClass)) {
            selector.removeClass(animationClass);
            setTimeout(() => {
                selector.addClass(animationClass);
            }, 0);
            return;
        }
        selector.addClass(animationClass);
    },
    // animation presets
    presets: {
        errorShake: 'animated shake error-border',
        rotate: 'rotating',
    },
};
},{}],2:[function(require,module,exports){
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



},{"./connection":3,"./controller":4,"./events":5}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{"../templates/templates":7,"./helpers":6}],5:[function(require,module,exports){
const controller = require('./controller');
const animations = require('./animations');

module.exports = (socket, appController) => {
    console.log("Initializing events...");
    
    this.missedICE = [];
    this.remoteDesc = null;
    // set up on join listener
    $('body').on('click', '#join-btn', () => {
        // select room id input
        let joinRoomInput = $('#join-room-input');
        // logo
        let logo = $('#logo');
        // get room value
        let room = joinRoomInput.val();
        if (!room || !room.length) {
            animations.dispatch(joinRoomInput, animations.presets.errorShake);
            // notify user
            return;
        } else {
            animations.dispatch(logo, animations.presets.rotate);            
        }
        appController.joinChatRoom(room);
    });

    // on nav-logo or exit click 
    $('body').on('click', '.nav-logo > #logo', () => {
        let logo = $('#logo');
        animations.dispatch(logo, animations.presets.rotate); 
        appController.loadHomepage();
    });

    $('body').on('click', '.room-info > #leave', () => {
        let logo = $('#logo');
        animations.dispatch(logo, animations.presets.rotate); 
        appController.loadHomepage();
    });

    $('body').on('click', '.user-actions > #sound-button', () => {
        if (!document.getElementById('localVideo').srcObject.getAudioTracks()[0].enabled) {
            $('#volume-off').addClass('hide-all');
            $('#volume-on').removeClass('hide-all');
            document.getElementById('localVideo').srcObject.getAudioTracks()[0].enabled = true;
        } else {
            $('#volume-on').addClass('hide-all');
            $('#volume-off').removeClass('hide-all');
            document.getElementById('localVideo').srcObject.getAudioTracks()[0].enabled = false;
        }
    });

    $('body').on('click', '.user-actions > #mic-button', () => {
        if ($("#remoteVideo").prop('muted') ) {
            $('#mic-on').addClass('hide-all');
            $('#mic-off').removeClass('hide-all');
            $("#remoteVideo").prop('muted', false);
        } else {
            $('#mic-off').addClass('hide-all');
            $('#mic-on').removeClass('hide-all');
            $("#remoteVideo").prop('muted', true);
        }
    });

    socket.on('joined', (data) => {
        let user = data.user;
        let isCaller = data.is_caller;

        console.log("Should call: "+isCaller);
        if(isCaller) {
            appController.makeOffer();
        } else {
            appController.waitOffer();
        }
    });

    socket.on('message', (data) => {
        console.log("Received message");
        console.log(data);

        if ((data.type == 'ice')) {
            console.log("Message type ice");
            if (this.remoteDesc) {
                if (this.missedICE.length > 0) {
                    this.missedICE.forEach(appController.addCandidate);
                    this.missedICE = [];
                }
                appController.addCandidate(data.payload.ice);
            } else {
                if(data.payload.ice) {
                    this.missedICE.push(data.payload.ice)
                }
            }
        }
        if (data.type == 'sdp') {
            this.remoteDesc = true;
            console.log("Message type sdp");
            appController.setRemoteDescription(data.payload.sdp);
        }
    });
};
},{"./animations":1,"./controller":4}],6:[function(require,module,exports){
/**
 * Module that contains the helper methods that are shared among
 * the scripts
 */
module.exports = {
    // renders the context using the selector to get the template
    render: (selector, context, clear = false) => {
        // if clear is set to true empty the DOM
        if (clear) {
            $('#root').html('');
        }
        // Retrieve the template data from the HTML (jQuery is used here).
        let template = $(selector).html();
        // Compile the template data into a function
        let templateScript = Handlebars.compile(template);
        // html = 'My name is Ritesh Kumar. I am a developer.'
        let html = templateScript(context);
        // Insert the HTML code into the page
        $('#root').append(html);
    },

    // compile the context using the selector to get the template
    compile: (selector, context) => {
        // Retrieve the template data from the HTML (jQuery is used here).
        let template = $(selector).html();
        // Compile the template data into a function
        let templateScript = Handlebars.compile(template);
        // html = 'My name is Ritesh Kumar. I am a developer.'
        let html = templateScript(context);
        return html;
    },
}
},{}],7:[function(require,module,exports){
/**
 * Handlebars templates
 */
module.exports = {
    // Homepage template
    home: `<script id="home-template" type="text/x-handlebars-template">
        <div id="root-wrapper" class="animated slideInDown">
            <!-- join room prompt component -->
            <div id="join-room-prompt-wrapper" class="vh-100 vw-100 flex-centered">
            <div id="join-room-prompt" class="flex-centered flex-column">
                <div id='logo-wrapper' class="flex-grow-1">
                <img id='logo' src="./assets/chrome.svg" alt="">
                </div>
                <input id='join-room-input' class="min-w-100" type="text" placeholder="Type the room name to join here: ">
                <div id='pusher' class="flex-grow-1"></div>
                <button id='join-btn' class="btn flex-centered min-w-100">
                <!-- <img src='./assets/arrow-right.svg'> -->
                <span>JOIN{{a}}</span>
                </button>
            </div>
            </div>
            <!-- join room prompt component end -->
        </div>
    </script>`,

    // room header template
    room_header: `<script id="home-template" type="text/x-handlebars-template">
        <div id='room-header' class='nav primary-bg-color text-white'>
            <div class='nav-logo'>
                <img id='logo' src="./assets/chrome.svg" alt="">
            </div>
            <div class='room-info'>
                <img id='hashtag' src="./assets/hash.svg" alt="">
                <span id='room-id-hash'>{{room_name}}</span>

                <img id='leave' src="./assets/download.svg" alt="">                
            </dive>
        </div>
    </script>`,

    // room header template
    room_footer: `<script id="home-template" type="text/x-handlebars-template">
        <div id='room-footer' class=''>
           <div id='message-badge-wrapper'>
            <span id='message-badge'>{{badge}}</span>
            <span id='message-badge-wrapper-inside'>Messages</span>
            <div>
                <img src="./assets/arrow-up.svg">
            </div>
           </div>
        </div>
    </script>`, 

    // Room template
    room: `<script id="home-template" type="text/x-handlebars-template">
        <div id="root-wrapper" class="animated slideInDown">
           {{{room_root}}}
        </div>
    </script>`,

    // Room template
    video: `<script id="home-template" type="text/x-handlebars-template">
            <video id="localVideo" autoplay muted></video>
            <video id="remoteVideo" autoplay></video>
            </video>
    </script>`,

    buttons: `<div class='user-actions'>
        <div id='mic-button'>
            <button id='mic-on'><img src='./assets/mic.svg'></button> 
            <button id='mic-off' class='hide-all'><img src='./assets/mic-off.svg'></button> 
        </div>
        <div id='sound-button'>
            <button id='volume-on'><img src='./assets/volume.svg'></button> 
            <button id='volume-off' class='hide-all'><img src='./assets/volume-x.svg'></button> 
        </div>
    </div>`,
};
},{}]},{},[1,2,3,4,5,6]);
