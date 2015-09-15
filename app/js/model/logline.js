
function LogLine(line) {
	this.buffer = line["buffer"];
	this.month = line["month"];
    this.day = line["day"];
    this.hour = line["hour"];
    this.minute = line["minute"];
    this.second = line["second"];
    this.milisecond = line["milisecond"];
    this.threadid = line["threadid"];
    this.processid = line["processid"];
    this.level = line["level"];
    this.tag = line["tag"];
    this.message = line["message"];

    this.customTag = undefined;
    this.currentSearch = undefined;
}

LogLine.prototype.toString = function(opts) {
	var str = "";
	if (opts && opts.indexOf("buffer") > -1) str += this.buffer+' ';
	str += this.month+'-'+this.day+' ';
	str += this.hour+':'+this.minute+':'+this.second+'.'+this.milisecond+' ';
	if (opts && opts.indexOf("threadid") > -1) str += this.threadid+' ';
	if (opts && opts.indexOf("processid") > -1) str += this.processid+' ';
	if (opts && opts.indexOf("level") > -1) str += this.level+' ';
	str += this.tag+' '+this.message;
	return str;
};
LogLine.prototype.toStringAll = function() {
	return this.toString(["buffer", "threadid", "processid", "level"]);
};

LogLine.prototype.toHTML = function() {
	return '<li id="'+(this.index || "")+'" '+
			 'class="logline level-'+this.level+' '+
					 (this.customTag || "")+' '+
					 (this.isCurrentSearch || "")+'">'+
				'<span class="index">'+(this.index || "")+'</span>'+
	            '<span class="buffer">'+(this.buffer[0] || "")+'</span>'+
	            '<span class="date">'+this.month+'-'+this.day+'</span>'+
	            '<span class="time">'+this.hour+':'+this.minute+':'+this.second+'.'+this.milisecond+'</span>'+
	            '<span class="tag">'+this.tag+'</span>'+
	            '<span class="message">'+this.message+'</span>'+
            '</li>';
};

module.exports = LogLine
