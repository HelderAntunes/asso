#!/usr/bin/env node
const amqp = require('amqplib');
const {
  amqpAddress
} = require('../config/vars');
var args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: node receive.js <exchange> <facility>.<room>");
  process.exit(1);
}

const open = amqp.connect(amqpAddress);
open.then(function (conn) {
  return conn.createChannel();
}).then(function (ch) {
  let ex = args[0];
  args.shift();

  ch.assertExchange(ex, 'topic', {
    durable: true
  });

  let q = '';

  ch.assertQueue(q, {
    exclusive: false
  });

  args.forEach(function(key) {
    ch.bindQueue(q.queue, ex, key);
  });

  ch.consume(q.queue, function (msg) {
    console.log(" [x] %s:'%s' from %s", msg.fields.routingKey, msg.content.toString(), msg.properties.appId);
  }, {
    noAck: true
  });
}).catch(e => {
  throw new Error(e)
});
