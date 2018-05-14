'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const utils = require('./utils');
const PORT = 8080;
const HOST = '0.0.0.0';

// Rabbit connection
const rabbitAPI = require('http-rabbitmq-manager').client({
  host : 'rabbitmq',
  port : 15672,
  timeout : 25000,
  user : 'guest',
  password : 'guest'
});

// DB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://database:27017/test');
const Message = require('./database').Message;

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
        // TODO: send to client through socketIO the object { msg, pub, topic, [subs] }
        var message = new Message({topic: msg.fields.routingKey, content: msg.content.toString(), publisher: msg.properties.appId});
        message.save();
        utils.sendToBroker('topic_logs', msg.fields.routingKey, msg.content.toString(), msg.properties.appId);
      }, {noAck: true});
    });
  });
});

// Routes
const topics = require('./routes/topics')(rabbitAPI);
const subscribers = require('./routes/subscribers')(rabbitAPI);
const messages = require('./routes/messages')(conn);
const publishers = require('./routes/publishers')();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect all routes
app.use('/topics', topics);
app.use('/messages', messages);
app.use('/publishers', publishers);
app.use('/subscribers', subscribers);

app.get('/overview', (req, res) => {
  rabbitAPI.overview(function  (err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send(utils.prettyJson(response));
    }
  });
});

app.post('/initdb', (req, res) => {
  require('./init-db').initdb();
  res.send({ "msg" : "success" });
});

// publishers -> queues -> subscribers
app.get('/tree', (req, res) => {
  const tree = { nodes: [], edges: []};
  let idCounter = 1;

  // TODO: add subscribers
  rabbitAPI.getBindingsForSource({
    vhost : 'vhost',
    exchange : 'proxy'
  }, function (err, response) {
    if (err) return res.send(err);

    let queues = JSON.parse(response);
    tree.nodes.push({ id: idCounter++, name: 'broker', regex: '#', type: 'broker' });
    for (let i = 0; i < queues.length; i++, idCounter++) {
      if (queues[i].destination.includes('amq.gen')) { // skip rabbit default queues
        idCounter--;
        continue;
      }

      tree.nodes.push( {
        id: idCounter,
        name: queues[i].destination,
        regex: queues[i].routing_key,
        type: 'queue'
      });
      tree.edges.push({ start: 1, end: idCounter });
    }

    Message.find().distinct('publisher', function(err, publishers) {
      if (err) return res.status(400).send(err);

      for (let i = 0; i < publishers.length; i++, idCounter++) {
        tree.nodes.push( {
          id: idCounter,
          name: publishers[i],
          type: 'publisher'
        });

        tree.edges.push({ start: idCounter, end: 1 });
      }

      res.send(tree);
    });
  });
});

let server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// socket.IO connection
var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('ping_server', function(msg){
    console.log('message: ' + msg);
    io.emit('ping_server', msg);
  });
});
