const router = require('express').Router();
const controller = require('../controllers/device.controller');

/**
 * Routes related to queues / topics
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
  .get(controller.topicMessages);

module.exports = router;