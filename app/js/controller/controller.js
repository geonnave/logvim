
function Controller(emitter, fragment) {
	this.emitter = emitter;
	this.fragment = fragment;
}
Controller.prototype.registerListeners = function() {
	console.log("to be implemented on subclass");
};

module.exports = Controller;
