
var LogLine = require('./logline.js');

var regex_timestamp = /(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2}).(\d{3})/;

var regex_v_threadtime = /\s+(\d+)\s+(\d+)\s+([A-Z])\s+(.+?):?\s+([\s\S]*)/;
var regex_v_time = /\s+([A-Z])\/(.*)\s?\(\s+(\d+)\): (.*)/;

var regex_logcat_v_threadtime = new RegExp(regex_timestamp.source + regex_v_threadtime.source);
var regex_logcat_v_time = new RegExp(regex_timestamp.source + regex_v_time.source);

var regex_buffer = /main|system|radio|crash|events|kernel/i;

/* This function acts like a Factory; it abstracts the different log message 
 *  formats, which are controlled by the following set of logcat verbose 
 *  (adb logcat -v <flab>) flags:
 *     [brief, process, tag, thread, raw, time, threadtime, long]
 * The most used (and useful) flags are "time" and "threadtime"
 */
function createLogLine(line, buffer) {
	line = line.replace('\r', '\n');

	if (!buffer && line.match(regex_buffer))
		buffer = line.match(regex_buffer)[0];

	var matched_line = undefined;
	if ((matched_line = line.match(regex_logcat_v_threadtime))) {
		return new LogLine(
			{
				buffer: (buffer || ""),
				month: matched_line[1],
			    day: matched_line[2],
			    hour: matched_line[3],
			    minute: matched_line[4],
			    second: matched_line[5],
			    milisecond: matched_line[6],
			    threadid: matched_line[7],
			    processid: matched_line[8],
			    level: matched_line[9],
			    tag: matched_line[10],
			    message: matched_line[11].trim()
			});
	} else if ((matched_line = line.match(regex_logcat_v_time))) {
		return new LogLine(
			{
				buffer: (buffer || ""),
				month: matched_line[1],
			    day: matched_line[2],
			    hour: matched_line[3],
			    minute: matched_line[4],
			    second: matched_line[5],
			    milisecond: matched_line[6],
			    threadid: "", // doesn't have threadtime
			    processid: matched_line[9],
			    level: matched_line[7],
			    tag: matched_line[8],
			    message: matched_line[10].trim()
			});
	}
	else {
		return;
	}
}

module.exports = createLogLine;
