const express = require('express');
const messageRoutes = require('./message.route');
const deviceRoutes = require('./device.route');
const topicRoutes = require('./topic.route');

const router = express.router();

/**
 * API Routes
 */
router.use('/messages', messageRoutes);
router.use('/devices', deviceRoutes);
router.use('/topics', topicRoutes);

module.exports = router;