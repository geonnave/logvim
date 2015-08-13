var spawn = require('child_process').spawn;
var AdbServer = require('./adb.js');
var LoglinesFragment = require('./loglines_fragment.js');

var llfrag = new LoglinesFragment(document);
var adb = new AdbServer();

var lastContentRedraw = Date.now();
var logbuffall = [];

// Object.defineProperty(logbuffall, "push", {
// 	configurable: false, enumerable: false, writable: false,
// 	value: function() {
// 		for (var i = 0, n = this.length, l = arguments.length; i<l; i++, n++){
// 			this[n] = arguments[i];
// 			if (arguments[i].tag.match(/wifistatemachine/i))
// 				llfrag.logsToShow.push(arguments[i]);
// 		}
// 		llfrag.redraw(Date.now());
// 		return n;
// 	}
// })

var mustRefilter = false;
// var filterRegex = /.*/i;
var filterRegex = /wifi/i;
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

document.querySelector(".cmdline input").value = "/"
document.querySelector(".cmdline input").onkeypress = function(e) {
	if (e.which == 13) {
		console.log("ENTERR");
		filterRegex = new RegExp(this.value, "i");
		mustRefilter = true;
	}
}

adb.logcat(function(line) {

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
		llfrag.start_tr = 0;
		llfrag.end_tr = llfrag.trsToShow_tr;
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
