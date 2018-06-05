const express = require('express');
const seeds = require('../seeds');
const rabbitAPI = require('../../config/rabbit');
const messageRoutes = require('./message.route');
const Message = require('../models/message.model');
const deviceRoutes = require('./device.route');
const topicRoutes = require('./topic.route');

const router = express.Router();

/**
 * API Routes
 */
router.use('/messages', messageRoutes);
router.use('/devices', deviceRoutes);
router.use('/topics', topicRoutes);

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
  .route('/seed')
  .get(async (req, res) => {
    await seeds.createTopics();
    await seeds.createMessages();
    res.ok({
      "msg": "Database seeded with success!"
    });
  });

router
  .route('/tree')
  .get((req, res) => {
    const tree = {
      nodes: [],
      edges: []
    };
    let idCounter = 1;

    rabbitAPI.getBindingsForSource({
      vhost: 'vhost',
      exchange: 'proxy'
    }, function (err, response) {
      if (err) return res.json(err);
      let queues = response;
      tree.nodes.push({
        id: idCounter++,
        name: 'broker',
        regex: '#',
        type: 'broker'
      });
      for (let i = 0; i < queues.length; i++, idCounter++) {
        if (queues[i].destination.includes('amq.gen')) { // skip rabbit default queues
          idCounter--;
          continue;
        }

        tree.nodes.push({
          id: idCounter,
          name: queues[i].destination,
          regex: queues[i].routing_key,
          type: 'queue'
        });
        tree.edges.push({
          start: 1,
          end: idCounter
        });
      }

      Message.find().distinct('publisher', function (err, publishers) {
        if (err) return res.badRequest(err);

        for (let i = 0; i < publishers.length; i++, idCounter++) {
          tree.nodes.push({
            id: idCounter,
            name: publishers[i],
            type: 'publisher'
          });

          tree.edges.push({
            start: idCounter,
            end: 1
          });
        }

        res.ok(tree);
      });
    });
  });

module.exports = router;