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
	line = (line.buffer+" "+
		line.month+'-'+line.day+" "+
		line.hour+':'+line.minute+':'+line.second+'.'+line.milisecond+" "+
		line.message)
	if (this.checkCase)
		return line.includes(this.args);
	return line.toLowerCase().includes(this.args.toLowerCase());
};

module.exports = FilterExactCmd;
