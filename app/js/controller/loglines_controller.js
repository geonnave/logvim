var Controller = require('./controller.js');
var LoglinesModel = require('../model/loglines_model.js');
var LoglinesFragment = require('../view/loglines_fragment.js');

LogLinesController.prototype = Object.create(Controller.prototype);
function LogLinesController(emitter) {
	var model = new LoglinesModel();
	var fragment = new LoglinesFragment(document, model);
	Controller.call(this, emitter, fragment, model);

	this.registerVolatileListeners();
	this.fragment.content.addEventListener("scroll", function(e) {
		this.redraw(true);
	}.bind(this));
}
LogLinesController.prototype.registerVolatileListeners = function(first_argument) {
	var self = this;
	$(".loglines-fragment ul li").on('click', function(e) {
		if (window.event.ctrlKey) {
			self.emitter.emit('ctrlClickSelect', $(this).attr("id"));
		} else if (window.event.altKey) {
			self.emitter.emit('clickUnSelectAll', $(this).attr("id"));
		}
	});
};
LogLinesController.prototype.redraw = function(doForce) {
	this.fragment.redraw(doForce);
	this.registerVolatileListeners();
};
LogLinesController.prototype.addLogLine = function(line) {
	this.model.addLogLine(line);
	// this.emitter.emit('dissectLine', line);
};

LogLinesController.prototype.applyFilter = function(filteredLines) {
	this.model.logsToShow = filteredLines;
	this.redraw(true);
};

module.exports = LogLinesController;
