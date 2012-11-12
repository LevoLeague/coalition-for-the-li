var Arduino = require('./arduino');

argv = require('optimist').argv;

a = new Arduino(argv.serial);
a.write(argv.message);