'use strict';

const express = require('express');
var cors = require('cors');

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

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send("Welcome to the API");
});

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


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
