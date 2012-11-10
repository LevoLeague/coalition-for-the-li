var stream = require('stream');
var util = require('util');

var Renderer = module.exports = function(){
  stream.call(this);
  this.writable = true;
};

util.inherits(Renderer, stream);

Renderer.prototype.write = function(data){
	this.emit('data',"console " +data);
};

Renderer.prototype.end = function(){
  this.emit('end');
};

// display is 9x14