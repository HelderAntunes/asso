const amqp = require('amqplib');
const { amqpAddress } = require('./vars');

const sendToBroker = (ex, key, content, publisher) => {
  const open = amqp.connect(amqpAddress);
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    ch.assertExchange(ex, 'topic', {
      durable: false
    });
    ch.publish(ex, key, new Buffer(content), {
      'appId': publisher
    });
  }).catch(e => {
    throw new Error(err)
  });
};

const sendMessageToProxy = () => {
  const open = amqp.connect(amqpAddress);
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    ch.assertExchange(ex, 'topic', {durable: false});
      ch.assertQueue('', {exclusive: true}, function(err, q) {
        ch.bindQueue(q.queue, ex, '#');
  
        ch.consume(q.queue, function(msg) {
          io.emit('ping_server', {
            content: msg.content.toString(),
            topic: msg.fields.routingKey,
            publisher: msg.properties.appId
          });
  
          var message = new Message({topic: msg.fields.routingKey, content: msg.content.toString(), publisher: msg.properties.appId});
          message.save();
  
          utils.sendToBroker('topic_logs', msg.fields.routingKey, msg.content.toString(), msg.properties.appId);
        }, {noAck: true});
      });
  }).catch(e => {
    throw new Error(err)
  });
}

module.exports = {
  sendMessageToProxy,
  sendToBroker
}