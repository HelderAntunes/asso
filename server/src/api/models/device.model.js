const mongoose = require('mongoose');

/**
 * Device Schema
 * @private
 */
const deviceSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptions: {
      type: Array,
      default: [],
    }
});

/**
 * @typedef Message
 */
const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;