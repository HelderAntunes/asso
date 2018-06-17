const mongoose = require('mongoose');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

mongoose.set('debug', true);

/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = () => {
  mongoose.connect('mongodb://database:27017/test', {
    keepAlive: 1,
  });
  return mongoose.connection;
};