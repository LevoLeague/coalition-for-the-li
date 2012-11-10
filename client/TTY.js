var stream = require('stream');
var util = require('util');
var charm = require('charm');
var winston = require('winston');

var header = 'ARDUINO LOL SHIELD SIMULATOR';

// display is 9x14
var x = 14;
var y = 9;

var TTY = module.exports = function(opt){
  opt = opt || {};
  stream.call(this);
  this.writable = true;
  this.charm = charm();
  this.maxx = opt.x || x;
  this.maxy = opt.y || y;
  this.sending = false;
  this.frames = [];
  this.setup(opt);
};

util.inherits(TTY, stream);

TTY.prototype.write = function(data){
  // data should be a 2d array of pixel data or an object with a delay and pixed data
  if(Array.isArray(data)){
    data = {
      delay: 200,
      data: data
    };
  }
  this.addFrame(data);
  return !this.sending
};

TTY.prototype.end = function(){
  process.stdout.end();
};

TTY.prototype.setup = function(opt){
  var charm = this.charm;
  charm.pipe(process.stdout);
  charm.reset();
  charm.cursor(false);
  this.headers();
};

TTY.prototype.headers = function(){
  this.charm.position(0,0);
  this.charm.write(header);
  this.charm.position(1,0);
};

TTY.prototype.addFrame = function(data){
  this.frames.push(data);
  if(!this.sending){
    this.nextFrame();
  }
};

TTY.prototype.nextFrame = function(){
  if(this.frames.length){
    return this.drawFrame(this.frames.shift());
  }
};

TTY.prototype.drawFrame = function(frame){
  winston.info('drawing frame', {delay:frame.delay, desc:frame.desc});
  this.sending = true;
  var charm = this.charm;
  charm.reset();
  charm.cursor(false);
  this.headers();
  var x = 2;
  var y = 2;
  frame.data.forEach(function(row){
    row.forEach(function(v){
      charm.position(x,y);
      if(v){
        W(charm);
      }else{
        charm.write(' ');
      }
      x++;
    });
    x = 0;
    y++;
  });
  charm.position(x,y);
  setTimeout(function(){
    winston.info('drawing frame done');
    this.sending = false;
    this.nextFrame();
  }.bind(this), frame.delay);
};

var W = function(c){ 
  c.background('white').write(' ');
  c.display('reset').foreground('white');
};

