var spawn = require('child_process').spawn;

var fs = require('fs');
var DissectorExecutable = require('./dissector_executable.js');

function DissectorsLoader() {
	this.emitter = new (require('events').EventEmitter);
	this.logvim_config = {};
	this.dissectorsList = {};

	this.running = undefined;
}
DissectorsLoader.prototype.loadExternalDissectors = function() {
	this.logvim_config = JSON.parse(fs.readFileSync("logvim.json").toString());
	if (!this.logvim_config)
		throw "logvim configuration is invalid!";

	Object.keys(this.logvim_config.dissectors).forEach(function(ds) {
		var currentDs = this.logvim_config.dissectors[ds];
		currentDs.name = ds;
		currentDs.logvim_path = ".";
		switch(currentDs.type) {
		case "executable":
			this.dissectorsList[ds] = new DissectorExecutable(currentDs, this.emitter);
		}
	}.bind(this));

	return Object.keys(this.dissectorsList);
};

DissectorsLoader.prototype.runExternalDissector = function(dsName) {
	if (!this.dissectorsList[dsName])
		throw dsName + " is not a configured dissector";

	this.dissectorsList[dsName].run();
	this.running = dsName;
};
DissectorsLoader.prototype.stopExternalDissector = function(dsName) {
	if (dsName && !this.dissectorsList[dsName])
		throw dsName + " is not a configured dissector";

	if (this.running != dsName)
		this.dissectorsList[this.running].stop();

	this.dissectorsList[dsName].stop();
	this.running = false;
};

DissectorsLoader.prototype.dissect = function(line) {
	if (!this.dissectorsList[this.running])
		throw this.running + " is not a configured dissector";

	this.dissectorsList[this.running].dissect(line);
};

module.exports = DissectorsLoader;
