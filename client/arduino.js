var serialport = require("serialport");
var stream = require('stream');
var util = require('util');
var winston = require('winston');
var SerialPort = serialport.SerialPort;

var serialtarget = '/dev/tty.usbmodem1411';


var Arduino = module.exports = function(target){
  var serialPort = new SerialPort((target || serialtarget), {
    parser: serialport.parsers.readline("\n"),
      baudRate: 9600, // this is synced to what was set for the Arduino Code
      dataBits: 8, // this is the default for Arduino serial communication
      parity: 'none', // this is the default for Arduino serial communication
      stopBits: 1, // this is the default for Arduino serial communication
      flowControl: false // this is the default for Arduino serial communication
  });
  this.port = serialPort;
  this.ready = false
  serialPort.on('open', function(){
    this.ready = true;
    this.emit('ready');
    winston.info('Arduino ready!');
  }.bind(this));

  this.port.on('error', function(err){
    this.emit('error',err);
  }.bind(this));
};

util.inherits(Arduino, stream);

Arduino.prototype.write = function(data,cb){
  data = data.toString().toUpperCase();
  if(!data.match(/\n$/)){
    data += "\n";
  }
  winston.info('SERIAL data',data);
  if(this.ready){
    return this.port.write(data,cb);
  }
  this.port.on('open',function(){
    winston.log('writing shit');
    this.port.write(data,cb);
  }.bind(this));
};