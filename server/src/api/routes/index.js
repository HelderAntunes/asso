const express = require('express');
const messageRoutes = require('./message.route');
const deviceRoutes = require('./device.route');
const topicRoutes = require('./topic.route');

const router = express.router();

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
  
  // publishers -> broker -> subscribers
  app.get('/tree', (req, res) => {
    const tree = { nodes: [], edges: []};
    let idCounter = 1;
  
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
  

/**
 * API Routes
 */
router.use('/messages', messageRoutes);
router.use('/devices', deviceRoutes);
router.use('/topics', topicRoutes);

module.exports = router;