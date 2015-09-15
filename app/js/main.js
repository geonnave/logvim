
{
	var spawn = require('child_process').spawn;
	var fs = require('fs');

	var AdbServer = require('./model/adb.js');
	var createLogLine = require('./model/logline_factory.js');

	var LoglinesFragment = require('./view/loglines_fragment.js');
	var TopMenuController = require('./controller/top_menu_controller.js');

	var HeaderController = require('./controller/header_controller.js');
	var CmdlineController = require('./controller/cmdline_controller.js');
	var LoglinesController = require('./controller/loglines_controller.js');

	var emitter = new (require('events').EventEmitter);

	var adb = new AdbServer();
	var llFrag = new LoglinesFragment(document);

	var llCtrl = new LoglinesController(emitter, llFrag);

	var topMenuCtrl = new TopMenuController(emitter);
	var cmdlCtrl = new CmdlineController(emitter);
	var headerCtrl = new HeaderController(emitter);

	var allLogLines = [];
	var customTaggedLines = {};
	var lastSearchLine = {};

	var isRunning = false;
	var hasJustStopped = false;
}

emitter.on('FilterCmd', function(cmd) {
	llFrag.logsToShow = cmdlCtrl.currentFilterCmd.execute(allLogLines);
	llCtrl.redraw(true);
});

emitter.on('SearchCmd', function(cmd, lastSearchArgs) {
	lastSearchLine.isCurrentSearch = undefined;
	var matchIndex = cmdlCtrl.currentSearchCmd.execute(llFrag.logsToShow, lastSearchArgs);
	if (!matchIndex)
		return;
	emitter.emit('clickUnSelectAll', matchIndex);
	lastSearchLine = allLogLines[matchIndex];
	llFrag.scrollToLine(matchIndex);
	llCtrl.redraw(false);
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
	llCtrl.redraw(true);
	stopLogcat();
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
	llCtrl.redraw(true);
	startLogcat();
});

emitter.on('saveLog', function(fileName) {
	fs.writeFile(
		fileName,
		allLogLines.reduce(function(p, c) {
			return p+c.toStringAll()+'\n';
		}, ""),
		function (err) {
			if (err) console.log("something is wrong: "+err);
		}
	);
});

emitter.on('openLog', function(fileName) {
	console.log('called openLog for: '+fileName);
	stopLogcat();
	fs.readFileSync(fileName.toString()).toString().split('\n').forEach(function(line) {
		line = createLogLine(line);
		line.index = allLogLines.length;
		allLogLines.push(line);
		if (cmdlCtrl.currentFilterCmd.doesMatch(line))
			llFrag.logsToShow.push(line);
	});
	llCtrl.redraw(true);
});

emitter.on('logcatToggle', function() {
	console.log('called logcatToggle to ' + !isRunning);
	(isRunning) ? stopLogcat() : startLogcat();
});

function stopLogcat() {
	adb.stopLogcat();
	hasJustStopped = true;
	isRunning = false;
}

function startLogcat() {
	if (hasJustStopped) {
		clearLogLines();
		hasJustStopped = false;
	}
	adb.startLogcat(function(line) {
		line.index = allLogLines.length;
		allLogLines.push(line);
		if (cmdlCtrl.currentFilterCmd.doesMatch(line)) {
			llFrag.logsToShow.push(line);
			llCtrl.redraw(false);
		}
	});
	isRunning = true;
}

function clearLogLines() {
	allLogLines = [];
	llFrag.logsToShow = [];
}

startLogcat();
