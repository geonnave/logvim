
function LoglinesFragment(myDocument) {
	console.log("llFrag");
	this.content = myDocument.querySelector(".central-content .loglines-fragment");
	this.beforeDiv = myDocument.querySelector(".loglines-fragment .before-div");
	this.afterDiv = myDocument.querySelector(".loglines-fragment .after-div");
	this.listFragment = myDocument.querySelector(".loglines-fragment .loglines-list");

	this.autoScroll = false;
	this.logsToShow = [];
	this.lastRedraw = Date.now();

	this.measureFragmentSizes();
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

	if (this.autoScroll)
		this.content.scrollTop = this.content.scrollHeight;
}
LoglinesFragment.prototype.makeHTML = function() {
	var html = '';
	for (var i = this.start_tr; i < this.end_tr; i++)
		html += this.logsToShow[i].toHTML();
	return html;
}
LoglinesFragment.prototype.getBeforeHeight = function() {
	return (this.start_tr * this.trSizeY_px)+"px";
}
LoglinesFragment.prototype.getAfterHeight = function() {
	return ((this.logsToShow.length - this.end_tr) * this.trSizeY_px)+"px";
}

LoglinesFragment.prototype.scrollToLine = function(index) {
	// $(".loglines .loglines-fragment ul li#"+index)
	var indexToShow = this.getIndexToShow(index);
	if (!indexToShow)
		return;
	this.content.scrollTop = indexToShow * this.trSizeY_px;
};
LoglinesFragment.prototype.getIndexToShow = function(index) {
	for (var i = 0; i < this.logsToShow.length; i++)
		if (this.logsToShow[i].index == index)
			return i;
};

module.exports = LoglinesFragment;
