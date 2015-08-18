
function LoglinesFragment(myDocument, emitter) {
	this.emitter = emitter;

	this.fragment = myDocument.querySelector(".loglines");
	this.content = myDocument.querySelector(".loglines .loglines-fragment");
	this.beforeDiv = myDocument.querySelector(".loglines .before-div");
	this.afterDiv = myDocument.querySelector(".loglines .after-div");
	this.listFragment = myDocument.querySelector(".loglines .loglines-list-fragment");

	this.autoScroll = false;
	this.logsToShow = [];
	this.lastRedraw = Date.now();

	this.measureFragmentSizes();

	this.content.addEventListener("scroll", (function(e) {
		this.redraw(true);
	}).bind(this));
}

LoglinesFragment.prototype.measureFragmentSizes = function () {
	// sizes and offsets in pixels
	this.trSizeY_px = 18; //TODO: do not hardcode this

	// normalize scroll size to a multiple of this.trSizeY_px
	this.scrollY_px = Math.floor(this.content.scrollTop/this.trSizeY_px)*this.trSizeY_px;
	// by doing this we actually manipulate the amount of scrolled pixels

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

LoglinesFragment.prototype.redraw = function (doForce) {
	if (!doForce && Date.now()-this.lastRedraw < 50)
		return;

	this.lastRedraw = Date.now();
	var lastStart = this.start_tr, lastEnd = this.end_tr;

	this.measureFragmentSizes();
	this.beforeDiv.style.height = this.getBeforeHeight();
	this.afterDiv.style.height = this.getAfterHeight();

	if (!doForce && (lastStart == this.start_tr && lastEnd == this.end_tr))
		return;

	this.listFragment.innerHTML = this.makeHTML();
	this.registerClickListeners();

	if (this.autoScroll)
		this.content.scrollTop = this.content.scrollHeight;
}
LoglinesFragment.prototype.makeHTML = function() {
	var html = '', c = null, ctag = null;
	for (var i = this.start_tr; i < this.end_tr; i++) {
		c = this.logsToShow[i];
		ctag = (!!c.customTag) ? "customTag" : "";
		html +=
			'<li id="'+c.index+
			'" class="logline level-'+c.level+' '+ctag+'">'+
                '<span class="index">'+c.index+'</span>'+
                '<span class="buffer">'+c.buffer[0]+'</span>'+
                '<span class="date">'+c.month+'-'+c.day+'</span>'+
                '<span class="time">'+c.hour+':'+c.minute+':'+c.second+'.'+c.milisecond+'</span>'+
                '<span class="tag">'+c.tag+'</span>'+
                '<span class="message">'+c.message+'</span>'+
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
LoglinesFragment.prototype.registerClickListeners = function() {
	var self = this;
	$(".loglines .loglines-fragment ul li").on('click', function(e) {
		if (window.event.ctrlKey) {
			self.emitter.emit('ctrlClickSelect', $(this).attr("id"));
			// $(this).toggleClass("customTag");
		} else {
			self.emitter.emit('clickUnSelectAll', $(this).attr("id"));
			// $(this).toggleClass("customTag");
		}
	});
};

module.exports = LoglinesFragment;
