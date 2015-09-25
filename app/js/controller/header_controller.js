var Controller = require('./controller.js');

var HeaderFragment = require('../view/header_fragment.js');

HeaderController.prototype = Object.create(Controller.prototype);
function HeaderController(emitter) {
	Controller.call(this, emitter, new HeaderFragment(document));

	var self = this;
	this.logcatToggle = $(".header .logcat-control .logcat-toggle");
	this.dissectorDropdown = $(".header .dissector-control");

	this.logcatToggle.click(function (e) {
		e.preventDefault();
		console.log('called logcatToggle click');
		self.emitter.emit('logcatToggle');
	});
}
HeaderController.prototype.registerDissectors = function(dissectors) {
	this.fragment.addDissectors(dissectors);
	var self = this;
	this.dissectorDropdown.find("li").on("click", function(e) {
		e.preventDefault();
		self.emitter.emit('clickDissector', $(this).text());
	});
};

module.exports = HeaderController;
