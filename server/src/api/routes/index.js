const express = require('express');
const messageRoutes = require('./message.route');
const publisherRoutes = require('./publisher.route');
const subscriberRoutes = require('./subscriber.route');
const topicRoutes = require('./topic.route');

const router = express.router();

/**
 * API Routes
 */
router.use('/messages', messageRoutes);
router.use('/publishers', publisherRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/topics', topicRoutes);

module.exports = router;