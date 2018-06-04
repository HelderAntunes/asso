const request = require('request');
const router = require('express').Router();
const utils = require('../utils');
let Message = require('../database').Message;

/**
 * Function that creates all the routes related to topics
 * @param service - The service used by the handlers
 * @returns {*} - A router containing all the routes/handlers
 */
module.exports = function topicsRouter(rabbitAPI) {

  router.get('/', (req, res) => {
    rabbitAPI.getBindingsForSource({
      vhost : 'vhost',
      exchange : 'proxy'
    }, function (err, response) {
      if (err) return res.send(err);
      res.send(utils.prettyJson(response));
    });
  });

  router.get('/:destination', (req, res) => {
    const destination = req.params.destination;
    rabbitAPI.getQueue({
      vhost : 'vhost',
      queue : destination
    }, function (err, response) {
      if (err) return res.send(err);
      res.send(response);
    });
  });

  router.post('/', (req, res) => {
    let queue_name = req.body.name;

    rabbitAPI.createQueue({
      vhost : 'vhost',
      queue : queue_name,
      auto_delete : false,
      durable : true,
      arguments : {},
    }, function (err, response_) {
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

  router.delete('/:destination', (req, res) => {
    let destination = req.params.destination;

    rabbitAPI.deleteQueue({
      vhost : 'vhost',
      queue : destination
    }, function (err, response) {
      if (err) return res.send(err);
      res.send(response);
    });
  });

  router.get('/:name/messages', (req, res) => {
    Message.find({topic: req.params.name}, function(err, msgs) {
      if (err) return res.status(400).send(err);
      res.send(msgs);
    });
  });

  return router;
};
