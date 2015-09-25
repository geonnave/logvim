
function Controller(emitter, fragment, model) {
	this.emitter = emitter;
	this.fragment = fragment;
	this.model = model;
}
Controller.prototype.registerListeners = function() {
	console.log("to be implemented on subclass");
};

module.exports = Controller;
