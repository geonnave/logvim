var Controller = require('./controller.js');

var DissectorFragment = require('../view/dissector_fragment.js');
var DissectorModel = require('../model/dissector_model.js');

var DissectorsLoader = require('../model/dissector/dissectors_loader.js');

DissectorController.prototype = Object.create(Controller.prototype);
function DissectorController(emitter) {
	Controller.call(this, emitter, 
		new DissectorFragment(document), 
		new DissectorModel());
	this.dissectorsLoader = new DissectorsLoader();
	this.model.dissectorNames = this.dissectorsLoader.loadExternalDissectors();

	var self = this;
	// this.emitter.on('dissectLine', function(line) {
	// 	self.dissectorsLoader.dissect('wifi-dissector', line);
	// });
	this.dissectorsLoader.emitter.on('eventDissected', function(event) {
		self.fragment.appendEvent(event);
		event.labels.forEach(function(label) {
			$(document).on("click", ".dissector-fragment ul li p#"+label.id, function(e) {
				e.preventDefault();
				self.emitter.emit("scrollLogLine", label.id);
			});
			self.emitter.emit("dissectedLogLine", label.id);
		});
	});
}
DissectorController.prototype.start = function(dsName) {
	this.fragment.reset();
	// this.dissectorsLoader.runExternalDissector(dsName);
	this.dissectorsLoader.runExternalDissector('wifi-dissector');
};
DissectorController.prototype.stop = function(dsName) {
	// this.dissectorsLoader.stopExternalDissector(dsName);
	this.dissectorsLoader.stopExternalDissector('wifi-dissector');
};
DissectorController.prototype.dissect = function(line) {
	this.dissectorsLoader.dissect(line);
};

module.exports = DissectorController;
