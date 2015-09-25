var expect = require("chai").expect;
var DissectorLoader = require("../app/js/model/dissector/dissectors_loader.js");

describe('DissectorLoader', function() {

    describe('#DissectorLoader()', function() {
        var dl = new DissectorLoader();
        it('should initialize correctly', function() {
            expect(dl.emitter).to.be.an('object');
        });
        it('should load configured dissectors', function() {
        	var dsNames = dl.loadExternalDissectors();
            expect(dsNames).to.be.an('array');
            // console.log(dsNames);
        });
        it('should run configured dissectors', function() {
        	var dl = new DissectorLoader();
        	var dsNames = dl.loadExternalDissectors();
        	dl.runExternalDissector('wifi-dissector');
        	dl.stopExternalDissector('wifi-dissector');
        });
    });
});
