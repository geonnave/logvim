
var spawn = require('child_process').spawn;

var logcat = spawn('adb', ['logcat', '-v', 'time']);
logcat.stdout.setEncoding('utf8');
logcat.stderr.setEncoding('utf8');

var wifi_machine = spawn('lib/machineizer.exe');
wifi_machine.stdout.setEncoding('utf8');
wifi_machine.stderr.setEncoding('utf8');
wifi_machine.stdin.setEncoding('utf8');

logcat.stdout.on('data', function(chunk) {
	// console.log(chunk);
	wifi_machine.stdin.write(chunk);
});

wifi_machine.stdout.on('data', function(chunk) {
    console.log(chunk);
});
