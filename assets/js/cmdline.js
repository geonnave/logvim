var cmds = require('./cmds.js');

function Cmdline() {
	var self = this;
	this.cmdInput = $(".cmdline .input input");
	this.buttonName = $(".cmdline .action-dropup button span.name");

	this.cmds = {
		// ":": new cmds.ColonCmd(),
		"/": new cmds.SearchCmd(),
		"~": new cmds.FilterCmd(),
		"=": new cmds.FilterExactCmd()
	};

	var dropupMenu = Object.keys(this.cmds).reduce(function(p, c) {
		return p+
			'<li><a href="#" data-cmd="'+self.cmds[c].symbol+'">'+
			self.cmds[c].name+'</a></li>';
	}, "");
	$(".cmdline .action-dropup ul").html(dropupMenu);

	this.currentCmd = this.cmds["~"];
	this.cmdInput.val(this.currentCmd.toString());
	this.buttonName.text(this.currentCmd.name);

	this.cmdInput.keypress(function(e) {
		if (e.which == 13) {
			console.log("ENTERR");
			filterRegex = new RegExp(this.value.slice(1), "i");
			mustRefilter = true;
		}
	});

	this.cmdInput.on('input', function() {
		var key = self.cmdInput.val()[0];
		if (key in self.cmds)
			self.buttonName.text(self.cmds[key].name)
	});

	$(".cmdline .action-dropup ul li > a").click(function(e) {
		var selected = $(this).data("cmd");
		self.cmdInput.val(selected);
		self.buttonName.text($(this).text());
		self.cmdInput.focus();
	});
}

module.exports = Cmdline;
