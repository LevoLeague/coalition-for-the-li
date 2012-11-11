var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8000);

var io = require('socket.io');

io.sockets.on('connection', function(socket){
  socket.emit('news', {hello: 'world'});
  socket.on('set message', function(data){
    console.log(data);
  });
});

console.log('Server running at http://0.0.0.0:8000/');
