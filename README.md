# ChatRoom
A simple webrtc video conference app

# Usage - Installation

To use this app locally you will need node.js with a version that supports at least
the basic ES6 syntax. 

To install the dependencies run `npm install` or by executing the install script
under the scripts folder.

You can run the service by executing node 'path to server/server.js' file or by executing 
the run.sh script under script folder.

Notices: 
 1. to run the script files you might need to change the file permissions.
 2. the run script will try to use the nodemon module if exists, to install run `npm install -g nodemon`

The default port for the service is 3000 but that can easily change by passing a PORT env parameter 
(e.g.: `PORT=1345 node server.js`) or by changing the config file under the server folder

To open the application in your browser just visit: http://localhost:PORT/
