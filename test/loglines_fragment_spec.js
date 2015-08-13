var expect = require("chai").expect;
var LoglinesFragment = require("../assets/js/loglines_fragment.js");

var fs = require("fs");
var jsdom = require("jsdom").jsdom;

describe('LoglinesFragment', function() {
    var data = fs.readFileSync(__dirname+'/../assets/index.html', 'utf8');
    var doc = jsdom(data);

    describe('#LoglinesFragment({document: a_dom})', function() {
        it('should initialize correctly', function() {
            var llfrag = new LoglinesFragment(doc);
            expect(llfrag).to.have.a.property('trSizeY_px', 20+2);
        });
    });

    describe('#get<After|Before>Height()', function() {
        var llfrag = new LoglinesFragment(doc);
        it('should return before height', function() {
            var beforeheight = llfrag.getBeforeHeight();
            expect(beforeheight).to.match(/[0-9]+px/);
            expect(beforeheight).to.equal("0px");
        });
        it('should return after height', function() {
            var afterheight = llfrag.getAfterHeight();
            expect(afterheight).to.match(/[0-9]+px/);
            expect(afterheight).to.equal("0px");
        });
    });
});

