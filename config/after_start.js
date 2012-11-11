var io = require('socket.io');

io.sockets.on('connection', function(socket){
  socket.emit('news', {hello: 'world'});
  socket.on('set message', function(data){
    console.log(data);
  });
});

