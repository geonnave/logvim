var expect = require("chai").expect;
var Dissector = require("../app/js/ui/dissector_fragment.js");

describe('Dissector', function() {
	var event = {
        id: 1,
        label: "Enter ConnectedState",
        style: {
            color: "#ff0000"
        }
    }
    var diss = new 
    var ll = new Dissector('main', line);
    describe('#Dissector(buffer, message)', function() {
        it('should initialize correctly', function() {
            expect(ll).to.have.a.property('buffer', 'main');
        });
        it('should have a correct toString method', function() {
            expect(ll.toString()).to.be.equal("09-02 16:18:58.735 GCoreUlr Successfully inserted location");
        });
        it('should work toString method with arguments', function() {
            expect(ll.toString(["buffer"])).to.be.equal("main 09-02 16:18:58.735 GCoreUlr Successfully inserted location");
            expect(ll.toString(["buffer", "threadid", "processid", "level"])).to.be.equal("main 09-02 16:18:58.735 1893 1967 I GCoreUlr Successfully inserted location");
            expect(ll.toString(["buffer", "threadid", "processid", "level"])).to.be.equal(ll.toStringAll());
        });
        it('should have a correct toHTML method', function() {
        	ll.index = 321;
            console.log(ll.toHTML());
        });
    });
});
