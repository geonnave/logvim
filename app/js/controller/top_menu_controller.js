
function TopMenuController(emitter) {
	this.emitter = emitter;

	var self = this;

	var remote = require('remote');
	this.Menu = remote.require('menu');
	this.dialog = remote.require('dialog');

	var template = [
		{
		  label: 'File',
		  submenu: [
			{
			  label: 'open',
			  accelerator: 'CmdOrCtrl+O',
			  selector: 'open:',
			  click: function() {
				console.log("will open!");
				self.dialog.showOpenDialog(function (fileName) {
				  if (fileName === undefined) return;
				  self.emitter.emit('openLog', fileName);
				});
			  }
			},
			{
			  label: 'save',
			  accelerator: 'CmdOrCtrl+S',
			  selector: 'save:',
			  click: function() {
				console.log("will save!");
				self.dialog.showSaveDialog(function (fileName) {
				  if (fileName === undefined) return;
				  self.emitter.emit('saveLog', fileName);
			  });
			  }
			}
		  ]
		}
	];

	this.menu = this.Menu.buildFromTemplate(template);
	this.Menu.setApplicationMenu(this.menu);
}

module.exports = TopMenuController;
