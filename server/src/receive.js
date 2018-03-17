#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var host = process.env.AMPQ_ADDRESS;

amqp.connect(host, function(err, conn) {
  if (err) throw new Error(err);

  conn.createChannel(function(err, ch) {
    if (err) throw new Error(err);

    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});
