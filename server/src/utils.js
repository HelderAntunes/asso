
function sendToBroker(ex, key, content, publisher) {
  let amqp = require('amqplib/callback_api');
  amqp.connect(process.env.AMPQ_ADDRESS, function(err, connection) {
    connection.createChannel(function(err, ch) {
      ch.assertExchange(ex, 'topic', {durable: false});
      ch.publish(ex, key, new Buffer(content), {'appId':publisher});
    });
  });

};

function prettyJson(jsonStr) {
  var cpy = JSON.parse(jsonStr);
  var str = JSON.stringify(cpy, null, 4);
  return str;
}

module.exports = {
  sendToBroker,
  prettyJson
}
