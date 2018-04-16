'use strict';

const express = require('express');
let cors = require('cors');

const PORT = 8080;
const HOST = '0.0.0.0';

// Rabbit connection
const client = require('http-rabbitmq-manager').client({
    host : 'rabbitmq',
    port : 15672,
    timeout : 25000,
    user : 'guest',
    password : 'guest'
});

// DB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://database:27017/test');
// run file 'test-db.js' inside container to test the db.

//Proxy Channel
let amqp = require('amqplib/callback_api');
const host = process.env.AMPQ_ADDRESS;

let Message = require('./database').Message;

let conn;

function send(ex, key, content, publisher) {
    conn.createChannel(function(err, ch) {

      ch.assertExchange(ex, 'topic', {durable: false});

      ch.publish(ex, key, new Buffer(content), {'appId':publisher});
    });
};

amqp.connect(host, function(err, connection) {
  if (err) throw new Error(err);
  conn = connection;
  conn.createChannel(function(err, ch) {
    var ex = 'proxy';

    ch.assertExchange(ex, 'topic', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {

      ch.bindQueue(q.queue, ex, '#');

      ch.consume(q.queue, function(msg) {
        var message = new Message({topic: msg.fields.routingKey, content: msg.content.toString(), publisher: msg.properties.appId});
        message.save();
        //messages.push({topic: msg.fields.routingKey, content: msg.content.toString(), publisher: msg.properties.appId});

        send('topic_logs', msg.fields.routingKey, msg.content.toString(), msg.properties.appId);
      }, {noAck: true});
    });
  });
});

const app = express();
app.use(cors());

//Pretty JSON html
function prettyJson(jsonStr) {
  var cpy = JSON.parse(jsonStr);
  var str = '<pre>' + JSON.stringify(cpy, null, 4) + '</pre>';

  return str;
}



app.get('/overview', (req, res) => {
  client.overview(function  (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.send(prettyJson(response));
        }
    });
});

app.get('/connections', (req, res) => {
  client.listConnections(function  (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.send(prettyJson(response));
        }
    });
});

app.get('/consumers', (req, res) => {
  client.listConsumers({
        vhost : 'vhost',
    }, function  (err, response) {
        if (err) {
          res.send(err);
        } else {
          res.send(prettyJson(response));
        }
    });
});

app.get('/exchanges', (req, res) => {
  client.listExchanges({
        vhost : 'vhost',
    }, function  (err, response) {
        if (err) {
          res.send(err);
        } else {
          res.send(prettyJson(response));
        }
    });
});

app.get('/message', (req, res) => {
  Message.find({}, function(err, msgs) {
    if (err) return res.status(400).send(err);
    res.send(msgs);
  });
});

app.get('/message/:id', (req, res) => {
  Message.findById(req.params.id, (err, msg) => {
    if (err) return res.status(400).send(err);
    res.send(msg);
  });
});

app.post('/message', (req, res) => {
  res.send('Sent '+ req.headers.content + " to topic " + req.headers.topic + " by " + req.headers.publisher);
  /*amqp.connect(host, function(err, conn) {
    if(err) return res.status(400).send(err);*/
  send('proxy', req.headers.topic, req.headers.content, req.headers.publisher);
  //};
});

app.get('/topics', (req, res) => {
  Message.find().distinct('topic', function(err, topics) {
    if (err) return res.status(400).send(err);
    res.send(topics);
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
