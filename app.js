// Dependencies imports
require('dotenv').config();

// Own imports
const Server = require('./models/server');

// run server
const server = new Server();
server.listen();
