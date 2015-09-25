
{
	var fs = require('fs');

	var emitter = new (require('events').EventEmitter);

	var AdbServer = require('./model/adb.js');
	var createLogLine = require('./model/logline_factory.js');
	
	var TopMenuController = require('./controller/top_menu_controller.js');

	var LoglinesController = require('./controller/loglines_controller.js');
	var DissectorController = require('./controller/dissector_controller.js');

	var HeaderController = require('./controller/header_controller.js');
	var CmdlineController = require('./controller/cmdline_controller.js');

	var adb = new AdbServer();

	var llCtrl = new LoglinesController(emitter);
	var dissCtrl = new DissectorController(emitter);

	var topMenuCtrl = new TopMenuController(emitter);
	var cmdlCtrl = new CmdlineController(emitter);
	var headerCtrl = new HeaderController(emitter);
	headerCtrl.registerDissectors(dissCtrl.model.dissectorNames);

	var isRunning = false;
	var hasJustStopped = false;
}

emitter.on('newLogLine', function(line) {
	llCtrl.addLogLine(line);
	if (cmdlCtrl.currentFilterCmd.doesMatch(line))
		llCtrl.model.logsToShow.push(line);
	emitter.emit('doDissectLogLine', line.index);
})

emitter.on('clickDissector', function(dsName) {
	if (dissCtrl.dissectorsLoader.running == dsName) {
		console.log("should stop "+dsName);
		dissCtrl.stop(dsName);
	} else {
		console.log("should start "+dsName);
		dissCtrl.start(dsName);
	}
});

emitter.on('startDissector', function(dsName) {
	console.log(dsName);
});

emitter.on('stopDissector', function(dsName) {
	console.log(dsName);
});

emitter.on('doDissectLogLine', function(index) {
	// console.log("should dissect "+index);

	if (!dissCtrl.dissectorsLoader.running) {
		dissCtrl.model.logsToDissect.push(index);
		return;
	}

	// dissect all lines that weren't before..
	while (dissCtrl.model.logsToDissect.length > 0)
		dissCtrl.dissect(dissCtrl.model.logsToDissect.shift());

	dissCtrl.dissect(llCtrl.model.allLogLines[index]);
})

emitter.on('dissectedLogLine', function(index) {
	llCtrl.model.allLogLines[index].isDissected = "isDissected";
});

emitter.on('scrollLogLine', function(index) {
	llCtrl.fragment.scrollToLine(index);
});

emitter.on('FilterCmd', function(callback) {
	llCtrl.applyFilter(cmdlCtrl.currentFilterCmd.execute(llCtrl.model.allLogLines));
});

emitter.on('SearchCmd', function(cmd, lastSearchArgs) {
	llCtrl.model.lastSearchedLine.isCurrentSearch = undefined;
	var matchIndex = cmdlCtrl.currentSearchCmd.execute(llCtrl.model.logsToShow, lastSearchArgs);
	if (!matchIndex)
		return;
	llCtrl.model.allLogLines[matchIndex].isCurrentSearch = "isCurrentSearch";
	llCtrl.model.lastSearchedLine = llCtrl.model.allLogLines[matchIndex];
	llCtrl.fragment.scrollToLine(matchIndex);
	llCtrl.redraw(true);
});

emitter.on('ctrlClickSelect', function(id) {
	var id = parseInt(id);
	if (llCtrl.model.allLogLines[id].isBookmarked) {
		llCtrl.model.allLogLines[id].isBookmarked = undefined;
		llCtrl.model.bookmarkedLines[id] = undefined;
	} else {
		llCtrl.model.allLogLines[id].isBookmarked = 'isBookmarked';
		llCtrl.model.bookmarkedLines[id] = llCtrl.model.allLogLines[id];
	}
	llCtrl.redraw(true);
});

emitter.on('clickUnSelectAll', function(id) {
	var id = parseInt(id);
	var wasSelected = llCtrl.model.bookmarkedLines[id];
	Object.keys(llCtrl.model.bookmarkedLines).forEach(function(e) {
		llCtrl.model.allLogLines[parseInt(e)].isBookmarked = undefined;
	});
	llCtrl.model.bookmarkedLines = {};
	if (!wasSelected) {
		llCtrl.model.allLogLines[id].isBookmarked = 'isBookmarked';
		llCtrl.model.bookmarkedLines[id] = llCtrl.model.allLogLines[id];
	}
	llCtrl.redraw(true);
});

emitter.on('saveLog', function(fileName) {
	fs.writeFile(
		fileName,
		llCtrl.model.allLogLines.reduce(function(p, c) {
			return p+c.toStringAll()+'\n';
		}, ""),
		function (err) {
			if (err) console.log("something is wrong: "+err);
		}
	);
});

emitter.on('openLog', function(fileName) {
	stopLogcat();
	clearLogLines();
	fs.readFileSync(fileName.toString()).toString().split('\n').forEach(function(line) {
		if (!(line = createLogLine(line)))
			return;
		emitter.emit('newLogLine', line);
	});
	console.log('read '+llCtrl.model.allLogLines.length+' lines from: '+fileName);
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
		emitter.emit('newLogLine', line);
		llCtrl.redraw(false);
	});
	isRunning = true;
}

function clearLogLines() {
	llCtrl.model.allLogLines = [];
	llCtrl.model.logsToShow = [];
}

// startLogcat();
