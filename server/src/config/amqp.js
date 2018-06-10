const amqp = require('amqplib');
var all = require('bluebird').all;
const { amqpAddress } = require('./vars');
const io = require('./socket').io();

const publish = (params) => {
  const open = amqp.connect(amqpAddress);
  open.then(function(conn) {
    if(params.periodic.isPeriodic) {
      setTimeout(function() { conn.close(); }, params.periodic.duration);
    }
    return conn.createChannel();
  }).then(function(ch) {
    ch.assertExchange('proxy', 'topic', {
      durable: false
    });
    if(params.periodic.isPeriodic) {
      setInterval(function(){ 
        ch.publish('proxy', params.key, new Buffer(params.content), {
          'appId': params.publisher
        }); 
      }, params.periodic.interval);
    } else {
      ch.publish('proxy', params.key, new Buffer(params.content), {
        'appId': params.publisher
      });
    }
  }).catch(e => {
    throw new Error(e)
  });
};

const consume = (routingKey) => {
  const open = amqp.connect(amqpAddress);
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    ch.assertExchange('proxy', 'topic', {durable: false});
      ch.assertQueue('', {exclusive: true}, function(err, q) {
        ch.bindQueue(q.queue, 'proxy', routingKey);
  
        ch.consume(q.queue, function(msg) {
          const identifier = msg.receiver.replace(/[^A-Z0-9]/ig, "_");
          io.emit(`consumeMessage_${identifier}`, msg);
        }, {noAck: true});
      });
  }).catch(e => {
    throw new Error(e)
  });
}

module.exports = {
  consume,
  publish
}