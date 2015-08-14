var spawn = require('child_process').spawn;

var AdbServer = require('./adb.js');
var LoglinesFragment = require('./loglines_fragment.js');
var Cmdline = require('./cmdline.js');

var llfrag = new LoglinesFragment(document);
var adb = new AdbServer();
var cmdl = new Cmdline();

var lastContentRedraw = Date.now();
var logbuffall = [];

var mustRefilter = false;
var filterRegex = /.*/i;
// var filterRegex = /wifi/i;
// var filterRegex = /NetworkController.WifiS/i;
// var filterRegex = /wifistatemachine/i;

function doesMatch(e) {
	return (
		e.buffer+" "+
		e.month+'-'+e.day+" "+
		e.hour+':'+e.minute+':'+e.second+'.'+e.milisecond+" "+
		e.message+" "
		).match(filterRegex);
}


adb.logcat(function(line) {

	line.index = logbuffall.length;
	logbuffall.push(line);
	// console.log(logbuffall.length);
	if (!mustRefilter && doesMatch(line)) {
		llfrag.logsToShow.push(line);
		llfrag.redraw(Date.now());
	} else if (mustRefilter) {
		llfrag.logsToShow = logbuffall.filter(function(e) {
			return doesMatch(e);
		});
		console.log("logsToShow size "+llfrag.logsToShow.length);
		llfrag.redraw();
		mustRefilter = false;
	}

    // wifi_machine.stdin.write(line);
});

window.addEventListener( "resize", function(e) {
	llfrag.redraw();
});

// var wifi_machine = spawn('lib/machineizer.exe');
// wifi_machine.stdout.setEncoding('utf8');
// wifi_machine.stderr.setEncoding('utf8');
// wifi_machine.stdin.setEncoding('utf8');

// wifi_machine.stdout.on('data', function(chunk) {
//     console.log(chunk);
// });

