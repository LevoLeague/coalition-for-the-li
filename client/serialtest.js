var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var serialtarget = '/dev/tty.usbserial-FTE4XZRL';
var sp = new SerialPort(serialtarget, {
  parser: serialport.parsers.readline("\n"),
  baudRate: 9600, // this is synced to what was set for the Arduino Code
  dataBits: 8, // this is the default for Arduino serial communication
  parity: 'none', // this is the default for Arduino serial communication
  stopBits: 1, // this is the default for Arduino serial communication
  flowControl: false // this is the default for Arduino serial communication
});

//process.stdin.setRawMode(true);
//serialPort.pipe(process.stdout);
sp.on("data", function (data) {
  console.log("here: "+data);
});

sp.on('error', function (err) {
  console.error("error",err);
});
sp.on('open', doshit);

function doshit(){
  console.log('doing shit');
  process.stdin.pipe(sp);
  setInterval(function(){
    sp.write("FUCK YEA CHRISTMAS!!\n",function(){console.log("writecb",arguments);});
  },10000);
}