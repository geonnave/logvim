var FilterCmd = require('./filter_cmd.js');

SearchCmd.prototype = Object.create(FilterCmd.prototype);
function SearchCmd() {
	FilterCmd.call(this, "/", "Search");
	this.matches = [];
	this.matchIndex = 0;
};
SearchCmd.prototype.execute = function(input, lastArgs) {
	// in case user filter didn't change
	if (lastArgs.toString() == this.args.toString()) {
		if (this.matches.length < 1)
			return;
		if (this.matchIndex+1 > this.matches.length)
			this.matchIndex = 0;
		return this.matches[this.matchIndex++].index;
	}
	this.matchIndex = 0;
	this.matches = input.filter(function(line) {
		return this.doesMatch(line);
	}.bind(this));
	if (this.matches.length < 1)
		return;
	return this.matches[this.matchIndex++].index;
};

module.exports = SearchCmd;
