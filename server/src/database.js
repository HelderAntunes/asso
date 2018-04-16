var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    topic: String,
    content: String,
    publisher: String,
});

var Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message,
}
