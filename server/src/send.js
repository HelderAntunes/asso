#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var host = process.env.AMPQ_ADDRESS;

amqp.connect(host, function(err, conn) {
  if (err) throw new Error(err);

  conn.createChannel(function(err, ch) {
    var ex = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    ch.assertExchange(ex, 'fanout', {durable: false});
    ch.publish(ex, '', new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
