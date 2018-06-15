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
            <video id="remoteVideo" autoplay muted></video>
            </video>
    </script>`,
};