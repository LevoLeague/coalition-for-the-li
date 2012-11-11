var io = require('socket.io');
io = io.listen(8124);

io.sockets.on('connection', function(socket){
  socket.emit('news', {hello: 'world'});
  socket.on('set message', function(data){
    console.log(data);
  });
});

