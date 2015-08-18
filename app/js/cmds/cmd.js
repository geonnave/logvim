
function Cmd(symbol, name) {
	this.symbol = symbol;
	this.name = name;
	this.args = /.*/;
}
Cmd.prototype.toString = function() {
	return (this.symbol + this.args.toString().slice(1, -1));
};
Cmd.prototype.execute = function(input) {
	console.log("to be implemented.. ("+input.length+")");
};
Cmd.prototype.setArgs = function(args) {  };

module.exports = Cmd;
