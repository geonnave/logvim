
function Cmd(symbol, name) {
	this.symbol = symbol;
	this.name = name;
	this.args = /.*/i;
	this.memory = [];
	this.memoryIndex = 0;
}
Cmd.prototype.toString = function() {
	return (this.symbol + this.args.toString());
};
Cmd.prototype.addToMemory = function(toSave) {
	this.memoryIndex = this.memory.length;
	this.memory.push(toSave);
};
Cmd.prototype.gotoPreviousMemory = function() {
	this.memoryIndex--;
	this.args = this.memory[this.memoryIndex];
};
Cmd.prototype.gotoNextMemory = function() {
	this.memoryIndex++;
	this.args = this.memory[this.memoryIndex];
};
Cmd.prototype.hasPreviousMemory = function() {
	return this.memoryIndex > 0;
};
Cmd.prototype.hasNextMemory = function() {
	return this.memoryIndex+1 < this.memory.length;
};
Cmd.prototype.execute = function(input) {
	console.log("to be implemented.. ("+input.length+")");
};
Cmd.prototype.setArgs = function(args) {  };

module.exports = Cmd;
