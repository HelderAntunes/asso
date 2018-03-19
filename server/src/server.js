'use strict';

const express = require('express');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
  console.log("Hello world");
  var str = 'Hello World\n';

  var client = require('http-rabbitmq-manager').client({
      host : 'rabbitmq',
  	  port : 15672,
      timeout : 25000,
      user : 'guest',
      password : 'guest'
  });

  client.overview(function  (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.send(response);
        }
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
