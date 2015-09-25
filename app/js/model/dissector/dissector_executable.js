var Dissector = require('./dissector.js')
var spawn = require('child_process').spawn;

DissectorExecutable.prototype = Object.create(Dissector.prototype);
function DissectorExecutable(config, emitter) {
	Dissector.call(this, config, emitter);
	this.proc = undefined;
}

DissectorExecutable.prototype.run = function() {
	if (this.proc)
		this.stop();

	this.proc = spawn(this.getApplicationPath());
	this.proc.stdout.setEncoding('utf8');
	this.proc.stderr.setEncoding('utf8');
	this.proc.stdin.setEncoding('utf8');

	var self = this;
	this.proc.stdout.on('data', function(chunk) {
		chunk.split("\n").forEach(function(strEvent) {
	        if (!strEvent || strEvent.length <= 1)
	                return;
	        // console.log("got "+strEvent+"!");
	        // console.log("got "+JSON.parse(strEvent)+"!");
	        self.emitter.emit("eventDissected", JSON.parse(strEvent));
	    })
	})
};
DissectorExecutable.prototype.stop = function() {
	if (!this.proc)
		return;

	this.proc.kill();
	this.proc = undefined;
};

DissectorExecutable.prototype.dissect = function(line) {
	if (!this.proc)
        return;
    this.proc.stdin.write(line.index+" "+line.toStringAll()+"\n");
};

module.exports = DissectorExecutable;
