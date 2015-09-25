
function Dissector(config, emitter) {
	this.emitter = emitter;
	this.logvim_path = config.logvim_path;
	this.type = config.type;
	this.name = config.name;
	this.application_name = config.application_name;
}
Dissector.prototype.getApplicationPath = function() {
	return this.logvim_path+"/dissectors/"+this.name+"/"+this.application_name;
};

Dissector.prototype.run = function() {
};
Dissector.prototype.stop = function() {
};
Dissector.prototype.dissect = function() {
};

module.exports = Dissector;
