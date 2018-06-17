const mongoose = require('mongoose');

/**
 * Message Schema
 * @private
 */
const messageSchema = mongoose.Schema({
  periodic: {
    isPeriodic: {
      type: Boolean,
      default: false,
      required: true,
    },
    interval: {
      type: Number,
      default: 1000,
    },
    duration: {
      type: Number,
      default: 100000,
    },
  },
  key: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  receivers: {
    type: Array,
    default: [],
  }
});

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;