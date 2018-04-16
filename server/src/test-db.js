// Run this file inside of container

const mongoose = require('mongoose');
mongoose.connect('mongodb://database:27017/test');

const Message = mongoose.model('Message', { content: String, publisher: String });
Message.remove({ }, function (err) {
  if (err) return handleError(err);
  console.log('deleted all messages from db');

  const msg = new Message({ content: 'hello hugo', publisher: 'ademar' });
  msg.save().then(() => {
    console.log('created a new message');
    Message.find({}, function(err, msgs) {
       if (err) return handleError(err);
       console.log(msgs);
    });
  });
});
