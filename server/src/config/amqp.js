const amqp = require('amqplib');
var all = require('bluebird').all;
const {
  amqpAddress
} = require('./vars');

const publishToSource = (msg) => {
  const open = amqp.connect(amqpAddress);
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    ch.assertExchange('source', 'topic', {
      durable: false
    });
    ch.publish('source', msg.key, new Buffer(msg.content), {
      'appId': msg.publisher
    });
  }).catch(e => {
    throw new Error(e)
  });
};

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
      io.emit(`routing_key_message`, msg)
    }, {
      noAck: true
    });
  }).catch(e => {
    throw new Error(e)
  });
}

const consumeMessage = (routingKey, identifier) => {
  const open = amqp.connect(amqpAddress);
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    ch.assertExchange('source', 'topic', {
      durable: false
    });
    let q = '';
    ch.assertQueue(q, {
      exclusive: false
    });
    ch.bindQueue(q.queue, 'source', routingKey);

    ch.consume(q.queue, function (msg) {
      const device = msg.properties.appId.replace(/[^A-Z0-9]/ig, "_");
      //DEBUG Trying to figure out why message just won't be received!!!!
      io.emit(`message_${identifier}`, msg);
    }, {
      noAck: true
    });
  }).catch(e => {
    throw new Error(e)
  });
}

module.exports = {
  consumeThroughProxy,
  publishToProxy,
  publishToSource,
  consumeMessage
}
