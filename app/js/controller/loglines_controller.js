var Controller = require('./controller.js');

LogLinesController.prototype = Object.create(Controller.prototype);
function LogLinesController(emitter, fragment) {
	Controller.call(this, emitter, fragment);
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

module.exports = LogLinesController;
