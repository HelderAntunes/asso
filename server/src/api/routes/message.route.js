const router = require('express').Router();
const controller = require('../controllers/message.controller');

/**
 * Routes related to messages sent between devices
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

module.exports = router;