var Cmd = require('./cmd.js');

FilterCmd.prototype = Object.create(Cmd.prototype);
function FilterCmd(symbol, name) {
	Cmd.call(this, symbol, name);
}
FilterCmd.prototype.setArgs = function(args) {
	this.args = new RegExp(
		args.replace(/\/c$/, ""), (args.match(/\/c$/) ? "" : "i"));
};
FilterCmd.prototype.execute = function(input) {
	return input.filter(function(line) {
		return this.doesMatch(line);
	}.bind(this));
};
FilterCmd.prototype.doesMatch = function(line) {
	return (line.buffer+" "+
		line.month+'-'+line.day+" "+
		line.hour+':'+line.minute+':'+line.second+'.'+line.milisecond+" "+
		line.message
		).match(this.args);
};

module.exports = FilterCmd;
