
function LoglinesFragment(myDocument) {
	this.fragment = myDocument.querySelector(".loglines");
	this.content = myDocument.querySelector(".loglines .loglines-fragment");
	this.beforeDiv = myDocument.querySelector(".loglines .before-div");
	this.afterDiv = myDocument.querySelector(".loglines .after-div");
	this.listFragment = myDocument.querySelector(".loglines .loglines-list-fragment");

	this.autoScroll = true;
	this.logsToShow = [];
	this.lastRedraw = Date.now();

	this.measureFragmentSizes();

	this.content.addEventListener("scroll", (function(e) {
		if (this.scrollY_px < (this.sizeYOfAllPossibleTRs_px-this.contentYSize_px))
			this.autoScroll = false;
		else
			this.autoScroll = true;
		this.redraw();
	}).bind(this));
}

LoglinesFragment.prototype.measureFragmentSizes = function () {
	// sizes and offsets in pixels
	this.trSizeY_px = 20; //TODO: Fixme

	// normalize scroll size to a multiple of this.trSizeY_px
	this.scrollY_px = Math.floor(this.content.scrollTop/this.trSizeY_px)*this.trSizeY_px;

	this.contentYSize_px = this.content.clientHeight;

	// sizes and offsets in trs (table-rows)
	this.scrollY_tr = Math.floor(this.scrollY_px/this.trSizeY_px);
	this.contentYSize_tr = Math.ceil(this.contentYSize_px/this.trSizeY_px);
	this.allPossibleTRs_tr = this.logsToShow.length;

	this.sizeYOfAllPossibleTRs_px = this.allPossibleTRs_tr * this.trSizeY_px;

	// calculate first and last tr index to renderize, according to the 
	// current scroll offset
	this.start_tr = this.scrollY_tr;
	this.end_tr = this.scrollY_tr + this.contentYSize_tr;
	if (this.end_tr >= this.logsToShow.length) {
		this.end_tr = this.logsToShow.length;
		if (this.logsToShow.length-this.contentYSize_tr >= 0)
			this.start_tr = this.logsToShow.length - this.contentYSize_tr;
		else
			this.start_tr = 0;
	}
}

LoglinesFragment.prototype.shouldRedraw = function(now) {
	return (now-this.lastRedraw > 50);
};

LoglinesFragment.prototype.redraw = function (now) {
	if (this.logsToShow.length == 0 || ((now-this.lastRedraw) < 50))
		return;
	this.lastRedraw = now;
	var lastStart = this.start_tr, lastEnd = this.end_tr;
	this.measureFragmentSizes();
	this.beforeDiv.style.height = this.getBeforeHeight();
	this.afterDiv.style.height = this.getAfterHeight();
	if (lastStart == this.start_tr && lastEnd == this.end_tr)
		return;
	this.listFragment.innerHTML = this.makeHTML();
	if (this.autoScroll)
		this.content.scrollTop = this.content.scrollHeight;
}
LoglinesFragment.prototype.makeHTML = function() {
	var html = '';
	for (var i = this.start_tr; i < this.end_tr; i++) {
		html += 
			'<li class="logline level-'+this.logsToShow[i].level+'">'+
                '<span class="index">'+i+'</span>'+
                '<span class="buffer">'+this.logsToShow[i].buffer[0]+'</span>'+
                '<span class="date">'+this.logsToShow[i].month+'-'+this.logsToShow[i].day+'</span>'+
                '<span class="time">'+this.logsToShow[i].hour+':'+this.logsToShow[i].minute+':'+this.logsToShow[i].second+'.'+this.logsToShow[i].milisecond+'</span>'+
                '<span class="tag">'+this.logsToShow[i].tag+'</span>'+
                '<span class="message">'+this.logsToShow[i].message+'</span>'+
            '</li>';
	}
	return html;
}
LoglinesFragment.prototype.getBeforeHeight = function() {
	return (this.start_tr * this.trSizeY_px)+"px";
}
LoglinesFragment.prototype.getAfterHeight = function() {
	return ((this.logsToShow.length - this.end_tr) * this.trSizeY_px)+"px";
}

// var fs = require("fs");
// var jsdom = require("jsdom").jsdom;

// var doc = jsdom(fs.readFileSync('assets/index.html', 'utf8'));
// var llfrag = new LoglinesFragment(doc);

module.exports = LoglinesFragment;
