const amqp = require('amqplib');
var all = require('bluebird').all;
const {
  amqpAddress
} = require('./vars');

const publishToProxy = (params) => {
  const open = amqp.connect(amqpAddress);
  open.then(function (conn) {
    if (params.periodic.isPeriodic) {
      setTimeout(function () {
        conn.close();
      }, params.periodic.duration);
    }
    return conn.createChannel();
  }).then(function (ch) {
    ch.assertExchange('proxy', 'topic', {
      durable: true
    });
    if (params.periodic.isPeriodic) {
      setInterval(function () {
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

const consumeThroughProxy = (io) => {
  const open = amqp.connect(amqpAddress);
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    ch.assertExchange('proxy', 'topic', {
      durable: true
    });
    let q = 'proxy';
    ch.assertQueue(q, {
      exclusive: true
    });
    ch.bindQueue(q.queue, 'proxy', '#');

    ch.consume(q.queue, function (msg) {
      const device = msg.properties.appId.replace(/[^A-Z0-9]/ig, "_");
      const routingKey = msg.fields.routingKey.replace(/[^A-Z0-9]/ig, "_");
      io.emit(`message_${device}`, msg);
      io.emit(`routing_key_${routingKey}`, msg)
    }, {
      noAck: true
    });
  }).catch(e => {
    throw new Error(e)
  });
}

const consumeProxyMessage = (routingKey) => {
  const open = amqp.connect(amqpAddress);
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    ch.assertExchange('proxy', 'topic', {
      durable: false
    });
    ch.assertQueue('', {
      exclusive: false
    }, function (err, q) {
      ch.bindQueue(q.queue, 'proxy', routingKey);

      ch.consume(q.queue, function (msg) {
        const identifier = msg.receiver.replace(/[^A-Z0-9]/ig, "_");
        io.emit(`consumeMessage_${identifier}`, msg);
      }, {
        noAck: true
      });
    });
  }).catch(e => {
    throw new Error(e)
  });
}

module.exports = {
  consumeThroughProxy,
  publishToProxy,
  consumeProxyMessage
}