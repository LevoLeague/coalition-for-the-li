var io = require('socket.io').listen(8124);

io.sockets.on('connection', function(socket){
  socket.emit('text', "hello");
  socket.on('set message', function(data){
    console.log(data);
  });
});

setInterval(function(){
  io.sockets.emit('text','pray for this');
}, 5000);

