#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var host = process.env.AMPQ_ADDRESS;

amqp.connect(host, function(err, conn) {
  if (err) throw new Error(err);

  conn.createChannel(function(err, ch) {
    if (err) throw new Error(err);

    var q = 'hello';
    var msg = 'Hello World!';

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
