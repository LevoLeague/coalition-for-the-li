#!/usr/bin/env node
var io = require('socket.io-client');
var argv = require('optimist').argv;
var Renderer = require('./renderer');
var TTY = require('./TTY');
var Arduino = require('./arduino');
var stream = require('stream');

// INput
var server = argv.server || 'http://ourproject.com/';
var serialPort = argv.serial;

var renderer = new Renderer();

var socket2stream = function(server){
  var socket = io.connect(server,{
    reconnect : true
  });
  var s = new stream();
  socket.on('text', function(data){
    s.emit('data',data);
  });

  socket.on('connect',function(){
    console.log('connected to ' + server);
  });
  
  socket.on('disconnect', function(){
    console.error('omfg connection');
  });

  socket.on('connect_failed',function(){
    console.error('connect failed!');
  });

  s.socket = socket;
  return s;
};

var go = function(){
  var output;
  if(serialPort){
  	output =  Arduino(serialPort);
  }else{
  	output = new TTY();
  }

  var socket;
  if(server === 'local'){
     socket = process.stdin;
  }else{
    socket = socket2stream(server);
    console.log('socket!', socket);
  }

  socket.pipe(renderer);
  renderer.pipe(output);
};

go();