const express = require('express');
const rabbitAPI = require('../../config/rabbit');
const messageRoutes = require('./message.route');
const Message = require('../models/message.model');
const deviceRoutes = require('./device.route');
const queueRoutes = require('./queue.route');

const router = express.Router();

/**
* API Routes
*/
router.use('/messages', messageRoutes);
router.use('/devices', deviceRoutes);
router.use('/queues', queueRoutes);

router
.route('/overview')
.get((req, res) => {
  rabbitAPI.overview(function (err, response) {
    if (err) {
      res.internalServerError(err);
    } else {
      res.ok(response);
    }
  });
});

router
.route('/bindings')
.get((req, res) => {
  rabbitAPI.listBindings({
    vhost : 'vhost'
  }, function (err, response) {
    if (err) {
      res.internalServerError(err);
    } else {
      res.ok(JSON.parse(response));
    }
  });
});

router
.route('/tree')
.get((req, res) => {
  let tree = {
    nodes: [],
    edges: []
  };

  rabbitAPI.listQueues({
    vhost: 'vhost'
  }, function (err, response) {
    if (err) {
      res.internalServerError(err);
    } else {
      tree.nodes = JSON.parse(response).map(queue => { return {id: queue.name}; });
      tree.nodes.shift()
      tree.nodes.unshift({id:'source','name':'source'})

      rabbitAPI.getBindingsForSource({
        vhost: 'vhost',
        exchange: 'source'
      }, function (err, response) {
        if (err) {
          res.internalServerError(err);
        } else {
          tree.edges = JSON.parse(response).map(binding => { return {sid: binding.source, tid: binding.destination, name: binding.routing_key}; });

          rabbitAPI.listConsumers({
            vhost : 'vhost',
          }, function  (err, response) {
            if (err) {
              res.internalServerError(err);
            } else {
              let nodes = JSON.parse(response).map(consumer => { return {id: consumer.consumer_tag, name: ''}; });
              let edges = JSON.parse(response).map(consumer => { return {sid: consumer.queue.name, tid: consumer.consumer_tag, name: ''}; });

              Array.prototype.push.apply(tree.nodes,nodes);
              Array.prototype.push.apply(tree.edges,edges);

              res.ok(tree);
            }
          });
        }
      });
    }
  });
});

module.exports = router;
