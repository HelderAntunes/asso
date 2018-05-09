const router = require('express').Router();
const Message = require('../database').Message;

/**
 * Function that creates all the routes related to publishers
 * @param service - The service used by the handlers
 * @returns {*} - A router containing all the routes/handlers
 */
module.exports = function publishersRouter() {

  router.get('/', (req, res) => {
    Message.find().distinct('publisher', function(err, publishers) {
      if (err) return res.status(400).send(err);
      res.send(publishers);
    });
  })

  return router;
};
