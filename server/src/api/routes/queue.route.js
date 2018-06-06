const router = require('express').Router();
const controller = require('../controllers/queue.controller');

/**
 * Routes related to queues
 */

router
  .route('/')
  .get(controller.index);

router
  .route('/:id')
  .get(controller.show);

router
  .route('/')
  .post(controller.create);

router
  .route('/:id')
  .delete(controller.destroy);

router
  .route('/:id/messages')
  .get(controller.queueMessages);

module.exports = router;