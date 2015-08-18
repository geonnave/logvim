var Cmd = require('./cmd.js');

ColonCmd.prototype = Object.create(Cmd.prototype);
function ColonCmd() {
	Cmd.call(this, ":", "Colon");
	this.msg = "";
	this.args = "";
	this.allowedMsgs = { 
		_settag: "settag", 
		_gototag: "gototag"
	};
}
ColonCmd.prototype.toString = function() {
	return (this.symbol + this.args.toString().slice(1, -1));
};

module.exports =  ColonCmd;
