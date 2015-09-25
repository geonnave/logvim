
function LoglinesModel() {
	this.allLogLines = [];
	this.logsToShow = [];
	this.bookmarkedLines = {};
	this.lastSearchedLine = {};
}

LoglinesModel.prototype.addLogLine = function(line) {
	line.index = (this.allLogLines.length);
	this.allLogLines.push(line);
};

module.exports = LoglinesModel;
