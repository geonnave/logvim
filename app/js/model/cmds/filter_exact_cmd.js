var FilterCmd = require('./filter_cmd.js');

FilterExactCmd.prototype = Object.create(FilterCmd.prototype);
function FilterExactCmd(symbol, name) {
	FilterCmd.call(this, symbol, name);
	this.args = "";
}
FilterExactCmd.prototype.toString = function() {
	return (this.symbol + this.args.toString());
};
FilterExactCmd.prototype.setArgs = function(args) {
	if (this.args != args) {
		this.checkCase = !!args.match(/\/c$/);
		this.args = args.replace(/\/c$/, "");
		this.addToMemory(this.args);
	}
};
FilterExactCmd.prototype.doesMatch = function(line) {
	if (this.checkCase)
		return line.toString().includes(this.args);
	return line.toString().toLowerCase().includes(this.args.toLowerCase());
};

module.exports = FilterExactCmd;
