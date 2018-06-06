const router = require('express').Router();
const controller = require('../controllers/device.controller');

/**
 * Routes related to devices i.e applications
 */

router
  .route('/')
  .get(controller.index);

router
  .route('/seed')
  .get(controller.seed);

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