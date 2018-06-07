const mongoose = require('mongoose');

/**
 * Message Schema
 * @private
 */
const messageSchema = mongoose.Schema({
    periodic: {
      static: {
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
      }
    },
    destination: {
      static: {
        type: {
          type: String,
          required: true,
        },
        topic: {
          type: String,
          required: false
        },
        receiver: {
          type: String,
          required: false,
        },
      }
    },
    publisher: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
});

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;