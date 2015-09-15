var spawn = require('child_process').spawn;
var events = require('events');

var createLogLine = require('./logline_factory.js');

var DBG = false;

function AdbServerCmd() {
    events.EventEmitter.call(this);
}
AdbServerCmd.prototype.__proto__ = events.EventEmitter.prototype;

function AdbServer(options) {
    if (options == undefined) options = {};
    this.port = options.port || 5037;
    this.logProcs = {};
    this.logBuffers = options.buffers || ["main", "system"];
    this.isLogRunning = false;
    //, "radio", "crash", "events", "kernel"];
}

AdbServer.prototype.stopLogcat = function() {
    Object.keys(this.logProcs).forEach(function(b) {
        this.logProcs[b].proc.kill();
    }.bind(this));
    this.isLogRunning = false;
    this.logProcs = [];
};

AdbServer.prototype.startLogcat = function(callback) {
    this.logBuffers.forEach(function(b) {
        this.logProcs[b] = this.cmd(['logcat', '-v', 'threadtime', '-b', b]);
    }.bind(this));
    this.isLogRunning = true;

    var onLogLine = function(line, buffer) {
        var lineObj = undefined;
        if ((lineObj = createLogLine(line, buffer))) 
            callback(lineObj);
    };

    this.logBuffers.forEach(function(b) {
        this.logProcs[b].emitter.on('stdline', function(line) {onLogLine(line, b)});
    }.bind(this));
}

AdbServer.prototype.cmd = function(cmd) {
    var stdOutBuff = '';
    var stdErrBuff = '';

    var proc = spawn('adb', ['-P', this.port].concat(cmd));
    var emitter = new AdbServerCmd();
    emitter.process = proc;
    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');
    proc.stdout.on('data', function(chunk) {
        var lines = chunk.split('\r\n');
        
        var lastElem = lines.pop();
        
        if (stdOutBuff != '') {
            lines[0] = stdOutBuff + lines[0];
        }
        
        if (lastElem != '\r\n') {
            stdOutBuff = lastElem;
        } else {
            stdOutBuff = '';
        }

        for (var l in lines) {
            emitter.emit('stdline', lines[l]);
        }
        if (DBG)        
        console.log('out : ' + chunk);
    });
    proc.stdout.on('close', function(code, signal) {
        if (DBG)
        console.log('out close: code('+code+'), signal('+signal+')');
        emitter.emit('stdclose', code, signal);
    });
    proc.stdout.on('end', function() {
        if (DBG)
        console.log('out end');
        emitter.emit('stdend');
    });
    proc.stdout.on('error', function(err) {
        if (DBG)
        console.log('out error: '+ err);
        emitter.emit('stderror', err);
    });
    proc.stderr.on('data', function(chunk) {
        var lines = chunk.split('\r\n');
        
        var lastElem = lines.pop();
        
        if (stdErrBuff != '') {
            lines[0] = stdErrBuff + lines[0];
        }
        
        if (lastElem != '\r\n') {
            stdErrBuff = lastElem;
        } else {
            stdErrBuff = '';
        }

        for (var l in lines) {
            emitter.emit('errline', lines[l]);
        }
        if (DBG)        
        console.log('err : ' + chunk);
    });
    proc.stderr.on('close', function(code, signal) {
        if (DBG)
        console.log('err close: code('+code+'), signal('+signal+')');
        emitter.emit('errclose', code, signal);
    });
    proc.stderr.on('end', function() {
        if (DBG)
        console.log('err end');
        emitter.emit('errend');
    });
    proc.stderr.on('error', function(err) {
        if (DBG)
        console.log('err error: '+ err);
        emitter.emit('errerror', err);
    });
    proc.on('exit', function(code, signal) {
        if (DBG)
        console.log('exit: code('+code+'), signal('+signal+')');
        emitter.emit('exit', code, signal);
    });
    proc.on('error', function(err) {
        if (DBG)
        console.log('error: '+err);
        emitter.emit('error', err);
    });
    return {emitter: emitter, proc: proc};
}

AdbServer.prototype.waitfordevice = function(callback) {
    var cmd = this.cmd(['wait-for-devices']);
    cmd.on('exit', function() {
        if (callback !== undefined)
            callback();
    });
    return cmd;
}

AdbServer.prototype.devices = function(callback) {
    var devices = [];
    var cmd = this.cmd(['devices', '-l']);
    cmd.on('stdline', function(line) {
        line = line.trim();
        if (line == 'List of devices attached' || line == '') return;
        var devArgs = line.split(' ').filter(function(n) { return n != '';});
        var device = {serial: devArgs.shift(), type: devArgs.shift()};

        for (var i in devArgs) {
            var param = devArgs[i].split(':');
            device[param[0]] = param[1];
        }
        devices.push(device);
    });
    cmd.on('stdend', function() {
        if (callback !== undefined)
            callback(devices);
    });
    return cmd;
}

AdbServer.prototype.connect = function(options, callback) {
    if (options == undefined) options = {};
    var port = options.port || 5555;
    var host = options.host || '127.0.0.1';
    if(port < 5555 || port > 5585) {
        throw new Error('connect: illegal port range');
    }
    var cmd = this.cmd(['connect', host + ':' + port]);
    cmd.on('stdline', function(line) {
        if (line.indexOf('connected to') === 0 ||
           line.indexOf('already connected to') === 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
    return cmd;
}

AdbServer.prototype.disconnect = function(options, callback) {
    if (options == undefined) options = {};
    var port = options.port || 5555;
    var host = options.host || '127.0.0.1';
    if(port < 5555 || port > 5585) {
        throw new Error('connect: illegal port range');
    }
    var cmd = this.cmd(['disconnect', host + ':' + port]);
    cmd.on('stdline', function(line) {
        //if (line.indexOf('No such device') === 0) {
            callback(true);
        //}
    });
    return cmd;
}

module.exports = AdbServer;
