const mongoose = require('mongoose');

/**
 * Message Schema
 * @private
 */
const messageSchema = mongoose.Schema({
    topic: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    publisher: {
      type: String,
      required: true
    },
});

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;