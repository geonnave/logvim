var Cmd = require('./cmd.js');

SearchCmd.prototype = Object.create(Cmd.prototype);
function SearchCmd() {
	Cmd.call(this, "/", "Search");
}

module.exports = SearchCmd;
