const router = require('express').Router();
const controller = require('../controllers/queue.controller');

/**
 * Routes related to queues
 */

router
  .route('/')
  .get(controller.index);

router
  .route('/seed')
  .get(controller.seed);

router
  .route('/:queueId/bindings/:bindingId')
  .post(controller.addBinding);

router
  .route('/:queueId/bindings/:bindingId')
  .delete(controller.removeBinding);

router
  .route('/:id/messages')
  .get(controller.queueMessages);

router
  .route('/:id/bindings')
  .get(controller.queueBindings);

router
  .route('/:id/consumers')
  .get(controller.queueConsumers);

router
  .route('/:id')
  .get(controller.show);

router
  .route('/')
  .post(controller.create);

router
  .route('/:id')
  .delete(controller.destroy);

module.exports = router;