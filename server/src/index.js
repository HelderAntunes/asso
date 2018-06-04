// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const socketIO = require('./config/socket');

// open mongoose connection
mongoose.connect();

// init Socket.io
const server = require('http').createServer(app);

socketIO.connect(server);

// listen to requests
app.listen(port, () => console.info(`Server initialized on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
