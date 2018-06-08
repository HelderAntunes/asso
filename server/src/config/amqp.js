const amqp = require('amqplib');
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

const consume = (params) => {
  const open = amqp.connect(amqpAddress);
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    ch.assertExchange('proxy', 'topic', {durable: false});
      ch.assertQueue('', {exclusive: true}, function(err, q) {
        ch.bindQueue(q.queue, 'proxy', params.key);
  
        ch.consume(q.queue, function(msg) {
          io.emit('ping_server', {
            content: msg.content.toString(),
            topic: msg.fields.routingKey,
            publisher: msg.properties.appId
          });
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