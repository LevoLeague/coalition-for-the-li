#!/usr/bin/env node
var io = require('socket.io-client');
var argv = require('optimist').argv;
var stream = require('stream');
var winston = require('winston');


winston.add(winston.transports.File,{filename:'log.log'});
winston.remove(winston.transports.Console);
winston.info('Starting up client');

var Renderer = require('./renderer');
var TTY = require('./TTY');
var Arduino = require('./arduino');

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
  // INput
  var server = argv.server;
  var stdin = argv.stdin;

  //outPUT
  var serialtarget = argv.serial;
  var tty = argv.tty;
  var stdout = argv.stdout;

  var outputs = [];
  if(serialtarget){
    if(typeof serialtarget == 'boolean'){
      serialtarget = '/dev/tty.usbmodem1411';
    }
    winston.info('serial target ', serialtarget);
    var arduino = new Arduino(serialtarget);
    outputs.push(arduino);
  }

  if(stdout){
    outputs.push(process.stdout);
  }

  if(tty){
    winston.info('tty out');
    var render = new Renderer();
    tty = new TTY();
    render.pipe(tty);
    outputs.push(render);
  }

  var inputs = [];
  if(stdin){
    inputs.push(process.stdin);
  }

  if(server){
    if(typeof server == 'boolean'){
      server = 'http://ourproject.com/';
    }
    var socket = socket2stream(server);
    inputs.push(socket);
  }

  if(!outputs.length || !inputs.length){
    console.error("Make sure to declare at least one input and one output");
    help();
    process.exit(1);
  }

  inputs.forEach(function(input){
    outputs.forEach(function(output){
      input.pipe(output);
    });
  });
};

function help(){
  var txt = argv['$0'] + " [options]\n";
  txt += "  Inputs\n";
  txt += "    --server[=http://socket.io/server/]\n";
  txt += "    --stdin\n";
  txt += "  Outputs\n";
  txt += "    --serial[=/dev/path/to/serialport]\n";
  txt += "    --tty\n";

  console.log(txt);
}

go();