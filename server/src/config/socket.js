const socketIO = require('socket.io');
let io = null;

exports.io = () => {
  return io;
}

exports.connect = (server) => {
  io = socketIO(server);

  io.on('connection', function(socket){
    console.log('User connected!');

    socket.on('disconnect', function(){
      console.log('User disconnected!');
    });

    socket.on('messageToTopic', function(msg){
      io.emit('ping_server', msg);
    });
  });
}