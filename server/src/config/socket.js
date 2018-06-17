const socketIO = require('socket.io');
const amqp = require('./amqp');
let io = null;

exports.obj = () => {
  return io;
}

exports.connect = (server) => {
  io = socketIO(server);

  io.on('connection', function(socket){
    console.log('User connected!');

    socket.on('disconnect', function(){
      console.log('User disconnected!');
    });

    socket.on('publish_message', function(msg){      
      amqp.publishToSource(msg);
    });
  });
}
