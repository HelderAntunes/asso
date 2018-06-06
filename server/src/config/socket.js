exports.connect = (server) => {
  const socketIO = require('socket.io')(server);

  socketIO.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('ping_server', function(msg){
      console.log('message: ' + msg);
      socketIO.emit('ping_server', msg);
    });
  });
}