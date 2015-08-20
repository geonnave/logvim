
{
	var spawn = require('child_process').spawn;

	var AdbServer = require('./util/adb.js');
	var LoglinesFragment = require('./ui/loglines_fragment.js');
	var Cmdline = require('./cmds/cmdline.js');

	var emitter = new (require('events').EventEmitter);

	var llfrag = new LoglinesFragment(document, emitter);
	var adb = new AdbServer();
	var cmdl = new Cmdline(emitter);

	var allLogLines = [];
	var customTaggedLines = {};
	var lastSearchLine = {};
}

emitter.on('FilterCmd', function(cmd) {
	llfrag.logsToShow = cmdl.currentFilterCmd.execute(allLogLines);
	llfrag.redraw(true);
});

emitter.on('SearchCmd', function(cmd, lastSearchArgs) {
	lastSearchLine.currentSearch = undefined;
	var matchIndex = cmdl.currentSearchCmd.execute(llfrag.logsToShow, lastSearchArgs);
	if (!matchIndex)
		return;
	emitter.emit('clickUnSelectAll', matchIndex);
	lastSearchLine = allLogLines[matchIndex];
	llfrag.scrollToLine(matchIndex);
	llfrag.redraw(true);
});

emitter.on('ctrlClickSelect', function(id) {
	var id = parseInt(id);
	if (allLogLines[id].customTag) {
		allLogLines[id].customTag = undefined;
		customTaggedLines[id] = undefined;
	} else {
		allLogLines[id].customTag = 'customTag';
		customTaggedLines[id] = allLogLines[id];
	}
	llfrag.redraw(true);
});

emitter.on('clickUnSelectAll', function(id) {
	var id = parseInt(id);
	var wasSelected = customTaggedLines[id];
	Object.keys(customTaggedLines).forEach(function(e) {
		allLogLines[parseInt(e)].customTag = undefined;
	});
	customTaggedLines = {};
	if (!wasSelected) {
		allLogLines[id].customTag = 'customTag';
		customTaggedLines[id] = allLogLines[id];
	}
	llfrag.redraw(true);
});

adb.logcat(function(line) {
	line.index = allLogLines.length;
	allLogLines.push(line);
	if (cmdl.currentFilterCmd.doesMatch(line)) {
		llfrag.logsToShow.push(line);
		llfrag.redraw(false);
	}

    // wifi_machine.stdin.write(line);
});

// var wifi_machine = spawn('lib/machineizer.exe');
// wifi_machine.stdout.setEncoding('utf8');
// wifi_machine.stderr.setEncoding('utf8');
// wifi_machine.stdin.setEncoding('utf8');

// wifi_machine.stdout.on('data', function(chunk) {
//     console.log(chunk);
// });
