var Arduino = require('./arduino');

argv = require('optimist').argv;

a = new Arduino(argv.serial);

setInterval(function(){
	a.write(argv.message);
},10000);
