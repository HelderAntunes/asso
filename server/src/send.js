#!/usr/bin/env node
function sendRandomTemperature(ex, ch)
{
    const facilities = ['home', 'work', 'school']
    const rooms = ['bedroom', 'kitchen', 'study', 'classrom', 'laboratory']
    var key = facilities[Math.floor(Math.random() * facilities.length)] + '.' + rooms[Math.floor(Math.random() * rooms.length)] ;
    var num = (Math.random() * 10) + 20;
    var msg = num.toFixed(2)+ 'ºC';
    ch.publish(ex, key, new Buffer(msg.toString()), {'appId':'thermometer'});
    console.log(" [x] Sent %s:'%s'", key, msg);
}

var amqp = require('amqplib/callback_api');
var host = process.env.AMPQ_ADDRESS;

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: node send.js <num_seconds_running>");
  process.exit(1);
}

amqp.connect(host, function(err, conn) {
  if (err) throw new Error(err);

  conn.createChannel(function(err, ch) {
    var ex = 'proxy';

    ch.assertExchange(ex, 'topic', {durable: false});

    setInterval(function(){ sendRandomTemperature(ex, ch)}, 1000);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, args[0]*1000);
});
