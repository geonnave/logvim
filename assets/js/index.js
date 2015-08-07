var loglines = document.querySelector(".loglines");
var loglinesContent = document.querySelector(".loglines .content");
var loglinesBefore = document.querySelector(".loglines .before-table");
var loglinesAfter = document.querySelector(".loglines .after-table");
var loglinesTBody = document.querySelector(".loglines .content table tbody");

var logbuff = [];
var logbuffall = [];
var newlogsCount = 0;

var scrollY_px = loglinesContent.scrollTop;//window.pageYOffset;
var contentYSize_px = [loglinesContent.clientWidth, loglinesContent.clientHeight];
var trSizeY_px = 20 + 2; //TODO: Fixme

var scrollY_tr = Math.floor(scrollY_px/trSizeY_px);
var trsToShow_tr = Math.ceil(contentYSize_px/trSizeY_px);
var allPossibleTRs_tr = logbuffall.length;

var sizeYOfAllPossibleTRs_px = allPossibleTRs_tr * trSizeY_px;

var lastContentRefresh = Date.now();

var spawn = require('child_process').spawn;

var AdbServer = require('./adb.js');
var adb = new AdbServer();
adb.logcat(function(line) {
	line.message = line.message.replace("\\r", "");
	logbuffall.push(line);
	newlogsCount++;
	checkAndUpdateContentSizes();
	if (newlogsCount > trsToShow_tr && (Date.now()-lastContentRefresh > 50)) {
		console.log(Date.now()+','+lastContentRefresh);
		lastContentRefresh = Date.now();
		drawScreenOnAllLogs(true);
	}

    // wifi_machine.stdin.write(line);
});

function checkAndUpdateContentSizes() {
	scrollY_px = loglinesContent.scrollTop;//window.pageYOffset;
	contentYSize_px = loglinesContent.clientHeight;
	trSizeY_px = 20 + 2; //TODO: Fixme

	scrollY_tr = Math.floor(scrollY_px/trSizeY_px);
	trsToShow_tr = Math.ceil(contentYSize_px/trSizeY_px);
	allPossibleTRs_tr = logbuffall.length;

	start_tr = scrollY_tr;
	if (scrollY_tr+trsToShow_tr < logbuffall.length) {
		end_tr = scrollY_tr+trsToShow_tr;
	} else {
		start_tr = logbuffall.length - trsToShow_tr;
		end_tr = logbuffall.length;
	}

	sizeYOfAllPossibleTRs_px = allPossibleTRs_tr * trSizeY_px;

	loglinesBeforeOffsetHeight = (scrollY_px - contentYSize_px);
}
function drawScreenOnAllLogs(shouldScrollToBottom) {
	var html = '';
	newlogsCount = 0;
	console.log('from '+start_tr+' to '+end_tr+'; maxtr: '+logbuffall.length);
	for (var i = start_tr; i < end_tr; i++) {
    	html += '<tr><td>'+i+'</td><td style="white-space: nowrap">'+logbuffall[i].month+'-'+logbuffall[i].day+'</td><td>'+logbuffall[i].hour+':'+logbuffall[i].minute+':'+logbuffall[i].second+'</td><td style="white-space: nowrap">'+logbuffall[i].tag+'</td><td style="white-space: nowrap">'+logbuffall[i].message+'</td></tr>';
	}
	if (scrollY_px == 0 && shouldScrollToBottom) {
		loglinesBefore.style.height = (sizeYOfAllPossibleTRs_px)+"px";
	} else {
		loglinesBefore.style.height = (scrollY_px)+"px";
	}
	loglinesTBody.innerHTML = html;
	if (scrollY_px < (sizeYOfAllPossibleTRs_px-contentYSize_px)) {
		loglinesAfter.style.height = (sizeYOfAllPossibleTRs_px-scrollY_px)+"px";
	} else {
		loglinesAfter.style.height = "0px";
	}
	if (shouldScrollToBottom) {
		loglinesContent.scrollTop = loglinesContent.scrollHeight;
	}
}

function drawScreen() {
	checkAndUpdateContentSizes();
	drawScreenOnAllLogs(false);
}

loglinesContent.addEventListener( "scroll", function(e) {
	drawScreen();
});
window.addEventListener( "resize", function(e) {
	drawScreen();
});


// var wifi_machine = spawn('lib/machineizer.exe');
// wifi_machine.stdout.setEncoding('utf8');
// wifi_machine.stderr.setEncoding('utf8');
// wifi_machine.stdin.setEncoding('utf8');

// wifi_machine.stdout.on('data', function(chunk) {
//     console.log(chunk);
// });
