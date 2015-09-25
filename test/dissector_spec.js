var expect = require("chai").expect;

var fs = require('fs');

var createLogLine = require("../app/js/model/logline_factory.js");
var DissectorExecutable = require("../app/js/model/dissector/dissector_executable.js");

describe('DissectorExecutable', function() {

    var emitter = require('events').EventEmitter;
    var dsExe = new DissectorExecutable({
        logvim_path: "..",
        name: "wifi-dissector",
        type: "executable",
        application_name: "wifi-dissector.exe"
    }, emitter);
    describe('#DissectorExecutable()', function() {
        it('should initialize correctly', function() {
            expect(dsExe).to.have.property('type', 'executable');
            expect(dsExe).to.have.property('name', 'wifi-dissector');
            expect(dsExe).to.have.property('application_name', 'wifi-dissector.exe');
        });
        it('application path must be ok', function() {
            expect(dsExe.getApplicationPath()).to.be.equal("../dissectors/wifi-dissector/wifi-dissector.exe");
        });
        it('should run external dissectors', function() {
            dsExe.run();
            expect(dsExe.proc).to.be.ok;
        });
        it('should stop external dissectors', function() {
            dsExe.stop();
            expect(dsExe.proc).to.not.be.ok;
        });
        // we should test emitter and stuff
    });
});
