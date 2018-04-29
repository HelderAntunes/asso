'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');
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
let Message = require('./database').Message;

// Proxy exchange
let amqp = require('amqplib/callback_api');
let conn;

amqp.connect(process.env.AMPQ_ADDRESS, function(err, connection) {
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
        sendToBroker('topic_logs', msg.fields.routingKey, msg.content.toString(), msg.properties.appId);
      }, {noAck: true});
    });
  });
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/overview', (req, res) => {
  client.overview(function  (err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send(prettyJson(response));
    }
  });
});

app.get('/messages', (req, res) => {
  Message.find({}, function(err, msgs) {
    if (err) return res.status(400).send(err);
    res.send(msgs);
  });
});

app.get('/messages/:id', (req, res) => {
  Message.findById(req.params.id, (err, msg) => {
    if (err) return res.status(400).send(err);
    res.send(msg);
  });
});

app.post('/messages', (req, res) => {
  res.send('Sent '+ req.body.content + " to topic " + req.body.topic + " by " + req.body.publisher);
  sendToBroker('proxy', req.body.topic, req.body.content, req.body.publisher);
});

app.get('/topics', (req, res) => {
  client.getBindingsForSource({
    vhost : 'vhost',
    exchange : 'proxy'
  }, function (err, response) {
    if (err) return res.send(err);
    res.send(prettyJson(response));
  });
});

app.get('/topics/:destination', (req, res) => {
  const destination = req.params.destination;
  client.getQueue({
    vhost : 'vhost',
    queue : destination
  }, function (err, response) {
    if (err) return res.send(err);
    res.send(response);
  });
});

app.post('/topics', (req, res) => {
  let queue_name = req.body.name;

  client.createQueue({
    vhost : 'vhost',
    queue : queue_name,
    auto_delete : false,
    durable : true,
    arguments : {},
  }, function (err, response) {
    if (err) return res.send(err);

    request.post({
      headers: {'content-type' : 'application/json'},
      url: 'http://guest:guest@rabbitmq:15672/api/bindings/vhost/e/proxy/q/' + queue_name,
      json: {"routing_key": queue_name + ".#", "arguments":{"x-arg": "value"}}
    }, function (error, response, body) {
      if (err) return res.send(err);
      res.send(response);
    });
  });
});

app.delete('/topics/:destination', (req, res) => {
  let destination = req.params.destination;

  client.deleteQueue({
    vhost : 'vhost',
    queue : destination
  }, function (err, response) {
    if (err) return res.send(err);
    res.send(response);
  });
})

// Assuming each subscriber has it's own queue
app.get('/subscribers', (req, res) => {
  client.listQueues({
    vhost : 'vhost'
  }, function (err, response) {
    if (err) {
      res.send(err);
    } else {
      let queues = JSON.parse(response);
      let data = []

      queues.forEach(function(element) {
        client.getQueueBindings({
          vhost : 'vhost',
          queue : element.name
        }, function (err2, response2) {
          if (err2) {
            res.send(err2);
          } else {
            let bindings = JSON.parse(response2);
            element.bindings = bindings;
            data.push(element)

            if(data.length == queues.length){
              res.send(data);
            }
          }
        });
      });
    }
  });
});

app.get('/topics/:name/messages', (req, res) => {
  Message.find({topic: req.params.name}, function(err, msgs) {
    if (err) return res.status(400).send(err);
    res.send(msgs);
  });
});

function sendToBroker(ex, key, content, publisher) {
  conn.createChannel(function(err, ch) {
    ch.assertExchange(ex, 'topic', {durable: false});
    ch.publish(ex, key, new Buffer(content), {'appId':publisher});
  });
};

function prettyJson(jsonStr) {
  var cpy = JSON.parse(jsonStr);
  var str = JSON.stringify(cpy, null, 4);
  return str;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
