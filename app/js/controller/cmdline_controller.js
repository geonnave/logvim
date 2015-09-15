var SearchCmd = require('../model/cmds/search_cmd.js');
var ColonCmd = require('../model/cmds/colon_cmd.js');
var FilterCmd = require('../model/cmds/filter_cmd.js');
var FilterExactCmd = require('../model/cmds/filter_exact_cmd.js');

function CmdlineController(emitter) {
	this.emitter = emitter;

	var self = this;
	this.cmdInput = $(".cmdline .input input");
	this.buttonName = $(".cmdline .dropup-left button span.name");

	this.cmds = {
		// ":": new cmds.ColonCmd(),
		"/": new SearchCmd(),
		"~": new FilterCmd("~", "FilterRegex"),
		"=": new FilterExactCmd("=", "FilterExact")
	};

	var dropupMenuOptions = Object.keys(this.cmds).reduce(function(p, c) {
		return p+
			'<li><a href="#" data-cmd="'+self.cmds[c].symbol+'">'+
			self.cmds[c].name+'</a></li>';
	}, "");
	$(".cmdline .dropup-left ul").html(dropupMenuOptions);

	this.currentSelectedCmd = this.cmds["~"];
	this.cmdInput.val(this.currentSelectedCmd.toString());
	this.buttonName.text(this.currentSelectedCmd.name);

	this.currentFilterCmd = this.cmds["~"];
	this.currentSearchCmd = this.cmds["/"];

	this.registerInputListeners();

	$(".cmdline .dropup-left ul li > a").click(function(e) {
		var selected = $(this).data("cmd");
		self.currentSelectedCmd = self.cmds[selected];
		self.cmdInput.val(self.cmds[selected].toString());
		self.buttonName.text($(this).text());
		self.cmdInput.focus();
	});

	this.cmdInput.focus();
}
CmdlineController.prototype.registerInputListeners = function() {
	var self = this;

	this.cmdInput.keypress(function(e) {
		if (e.which == 13) {
			var input = this.value;
			var cmd = input[0];
			if (!self.cmds[cmd]) {
				console.log("not a command");
				return;
			}
			switch(cmd) {
			case "~":
			case "=":
				self.currentSelectedCmd = self.currentFilterCmd = self.cmds[cmd];
				self.cmds[cmd].setArgs(input.slice(1));
				self.emitter.emit('FilterCmd', self.cmds[cmd]);
				break;
			case "/":
				self.currentSelectedCmd = self.currentSearchCmd = self.cmds[cmd];
				var lastArgs = self.cmds[cmd].args;
				self.cmds[cmd].setArgs(input.slice(1));
				self.emitter.emit('SearchCmd', self.cmds[cmd], lastArgs);
				break;
			}
		}
	});
	this.cmdInput.keydown(function(e) {
		if (e.keyCode == 38 /*up arrow*/) {
			if (!self.currentSelectedCmd.hasPreviousMemory())
				return;
			if (!self.currentSelectedCmd.hasNextMemory())
				// save the current input val; otherwise we will lost it
				self.currentSelectedCmd.setArgs(self.cmdInput.val().slice(1));
			self.currentSelectedCmd.gotoPreviousMemory();
			self.cmdInput.val(self.currentSelectedCmd.toString());
			self.buttonName.text(self.currentSelectedCmd.name);
		} else if (e.keyCode == 40 /*down arrow*/) {
			if (!self.currentSelectedCmd.hasNextMemory())
				return;
			self.currentSelectedCmd.gotoNextMemory();
			self.cmdInput.val(self.currentSelectedCmd.toString());
			self.buttonName.text(self.currentSelectedCmd.name);
		}
	});

	this.cmdInput.on('input', function() {
		var key = self.cmdInput.val()[0];
		if (key in self.cmds) {
			self.buttonName.text(self.cmds[key].name);
			self.currentSelectedCmd = self.cmds[key];
		}
	});
};

module.exports = CmdlineController;
