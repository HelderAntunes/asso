const mongoose = require('mongoose');

/**
 * Device Schema
 * @private
 */
const deviceSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
});

/**
 * @typedef Message
 */
const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;