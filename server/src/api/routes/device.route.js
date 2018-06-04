const router = require('express').Router();
const controller = require('../controllers/device.controller');

/**
 * Routes related to devices i.e applications
 */

router
  .route('/')
  .get(controller.index);

module.exports = router;