
function Cmd(symbol, name) {
	this.symbol = symbol;
	this.name = name;
}

function SearchCmd() {
	Cmd.call(this, "/", "Search");
	this.args = /.*/;
}
SearchCmd.prototype = Object.create(Cmd.prototype);
SearchCmd.prototype.toString = function() {
	return (this.symbol + this.args.toString().slice(1, -1));
};

function FilterCmd() {
	Cmd.call(this, "~", "Filter");
	this.args = /.*/;
}
FilterCmd.prototype = Object.create(Cmd.prototype);
FilterCmd.prototype.toString = function() {
	return (this.symbol + this.args.toString().slice(1, -1));
};

function FilterExactCmd() {
	Cmd.call(this, "=", "FilterExact");
	this.args = /.*/;
}
FilterExactCmd.prototype = Object.create(Cmd.prototype);
FilterExactCmd.prototype.toString = function() {
	return (this.symbol + this.args.toString().slice(1, -1));
};

function ColonCmd() {
	Cmd.call(this, ":", "Colon");
	this.msg = "";
	this.args = "";
	this.allowedMsgs = { 
		_settag: "settag", 
		_gototag: "gototag"
	};
}
ColonCmd.prototype = Object.create(Cmd.prototype);
ColonCmd.prototype.toString = function() {
	return (this.symbol + this.args.toString().slice(1, -1));
};

module.exports.Cmd = Cmd;
module.exports.SearchCmd = SearchCmd;
module.exports.ColonCmd = ColonCmd;
module.exports.FilterCmd = FilterCmd;
module.exports.FilterExactCmd = FilterExactCmd;
