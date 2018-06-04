const path = require('path');

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  amqpAddress: process.env.AMPQ_ADDRESS,
};