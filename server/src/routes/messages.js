const router = require('express').Router();
const utils = require('../utils');
const Message = require('../database').Message;

/**
 * Function that creates all the routes related to messages
 * @param service - The service used by the handlers
 * @returns {*} - A router containing all the routes/handlers
 */
module.exports = function messagesRouter() {

  router.get('/', (req, res) => {
    Message.find({}, function(err, msgs) {
      if (err) return res.status(400).send(err);
      res.send(msgs);
    });
  });

  router.get('/:id', (req, res) => {
    Message.findById(req.params.id, (err, msg) => {
      if (err) return res.status(400).send(err);
      res.send(msg);
    });
  });

  router.post('/', (req, res) => {
    res.send('Sent '+ req.body.content + " to topic " + req.body.topic + " by " + req.body.publisher);
    utils.sendToBroker('proxy', req.body.topic, req.body.content, req.body.publisher);
  });

  return router;
};
