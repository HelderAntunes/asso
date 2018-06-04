// Rabbit connection
const rabbitAPI = require('http-rabbitmq-manager').client({
  host : 'rabbitmq',
  port : 15672,
  timeout : 25000,
  user : 'guest',
  password : 'guest'
});

exports.rabbitAPI;
