var Cmd = require('./cmd.js');

RegExp.prototype.flags = function () {
    return (this.ignoreCase ? "i" : "c")
        + (this.multiline ? "m" : "")
        + (this.global ? "g" : "");
};

FilterCmd.prototype = Object.create(Cmd.prototype);
function FilterCmd(symbol, name) {
	Cmd.call(this, symbol, name);
}
FilterCmd.prototype.toString = function() {
	return (this.symbol + 
		this.args.toString().replace(/^\/|\/g?i?$|\(\?\:\)/g, ""));
};
FilterCmd.prototype.setArgs = function(args) {
	args = new RegExp(
		args.replace(/\/c$/, ""), "g"+(args.match(/\/c$/) ? "" : "i"));
	if (this.args.toString() != args.toString()) {
		this.args = args;
		this.addToMemory(this.args);
	}
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
		line.tag+' '+line.message
		).match(this.args);
};

module.exports = FilterCmd;
