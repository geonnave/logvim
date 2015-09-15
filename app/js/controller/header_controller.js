
function HeaderController(emitter) {
	this.emitter = emitter;

	var self = this;
	this.logcatToggle = $(".header .logcat-control .logcat-toggle");

	this.logcatToggle.click(function (e) {
		e.preventDefault();
		console.log('called logcatToggle click');
		self.emitter.emit('logcatToggle');
	});
}

module.exports = HeaderController;
