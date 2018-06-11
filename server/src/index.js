// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const io = require('./config/socket');
const amqp = require('./config/amqp');

// open mongoose connection
mongoose.connect();

// listen to requests
const server = app.listen(port, () => console.info(`Server initialized on port ${port} (${env})`));
io.connect(server);

amqp.consumeThroughProxy(io.obj());

/**
* Exports express
* @public
*/
module.exports = app;
