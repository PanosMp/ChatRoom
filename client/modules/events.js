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

    socket.on('joined', (data) => {
        let user = data.user;
        let isCaller = data.is_caller;

        if(isCaller) {
            appController.makeOffer();
        } else {
            appController.waitOffer();
        }
    });

    socket.on('message', (data) => {
        console.log("Received message");
        console.log(data);
        if(data.handshake) {
            console.log("Message type handshake");
            appController.makeOffer();
        }

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