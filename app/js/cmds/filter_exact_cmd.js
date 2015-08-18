var FilterCmd = require('./cmd.js');

FilterExactCmd.prototype = Object.create(FilterCmd.prototype);
function FilterExactCmd(symbol, name) {
	FilterCmd.call(this, symbol, name);
}
FilterExactCmd.prototype.setArgs = function(args) {
	this.checkCase = !!args.match(/\/c$/);
	this.args = args.replace(/\/c$/, "");
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
