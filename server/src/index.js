// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const socketIO = require('./config/socket');
const rabbitAPI = require('./config/rabbit');

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => console.info(`Server initialized on port ${port} (${env})`));

// init Socket.io
socketIO.connect(app);

/**
* Exports express
* @public
*/
module.exports = app;