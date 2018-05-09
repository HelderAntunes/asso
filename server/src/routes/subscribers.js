const router = require('express').Router();

/**
 * Function that creates all the routes related to subscribers
 * @param service - The service used by the handlers
 * @returns {*} - A router containing all the routes/handlers
 */
module.exports = function subscribersRouter(rabbitAPI) {

  // Assuming each subscriber has it's own queue
  router.get('/', (req, res) => {
    rabbitAPI.listQueues({
      vhost : 'vhost'
    }, function (err, response) {
      if (err) {
        res.send(err);
      } else {
        let queues = JSON.parse(response);
        let data = []

        queues.forEach(function(element) {
          rabbitAPI.getQueueBindings({
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

  router.get('/v2', (req, res) => {
    rabbitAPI.listConsumers({
      vhost : 'vhost',
    }, function  (err, res_) {
      if (err) {
        console.log(err);
      } else {
        res.send(res_);
      }
    });
  });

  return router;
};
