#!/usr/bin/env node
var io = require('socket.io-client');
var argv = require('optimist').argv;
var Renderer = require('./renderer');
var TTY = require('./TTY');
var Arduino = require('./arduino');

var server = argv.server || 'http://ourproject.com/';
var serialPort = argv.serial;

var renderer = new Renderer();

var output;
if(serialPort){
	output =  Arduino(serialPort);
}else{
	output = TTY();
}

var socket;
if(server === 'local'){
   socket = process.stdin;
}else{
  socket = io.connect(server);
}

socket.pipe(renderer);
renderer.pipe(output);
