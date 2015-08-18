var SearchCmd = require('./search_cmd');
var ColonCmd = require('./colon_cmd');
var FilterCmd = require('./filter_cmd');
var FilterExactCmd = require('./filter_exact_cmd');

function Cmdline(emitter) {
	this.emitter = emitter;

	var self = this;
	this.cmdInput = $(".cmdline .input input");
	this.buttonName = $(".cmdline .action-dropup button span.name");

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
	$(".cmdline .action-dropup ul").html(dropupMenuOptions);

	this.currentCmd = this.cmds["~"];
	this.cmdInput.val(this.currentCmd.toString());
	this.buttonName.text(this.currentCmd.name);

	this.currentFilterCmd = this.cmds["~"];
	this.currentSearchCmd = this.cmds["/"];

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
				self.cmds[cmd].setArgs(input.slice(1));
				self.emitter.emit('FilterCmd', self.cmds[cmd]);
				break;
			}
		}
	});

	this.cmdInput.on('input', function() {
		var key = self.cmdInput.val()[0];
		if (key in self.cmds)
			self.buttonName.text(self.cmds[key].name);
	});

	$(".cmdline .action-dropup ul li > a").click(function(e) {
		var selected = $(this).data("cmd");
		self.cmdInput.val(selected);
		self.buttonName.text($(this).text());
		self.cmdInput.focus();
	});

	this.cmdInput.focus();
}

module.exports = Cmdline;
