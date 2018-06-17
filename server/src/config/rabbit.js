const rabbitmq = require('http-rabbitmq-manager');

// Rabbit connection
const rabbitAPI = rabbitmq.client({
  host : 'rabbitmq',
  port : 15672,
  timeout : 25000,
  user : 'guest',
  password : 'guest'
});

module.exports = rabbitAPI;
