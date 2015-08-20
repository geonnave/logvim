var expect = require("chai").expect;
var LoglinesFragment = require("../app/js/ui/loglines_fragment.js");

var fs = require("fs");
var jsdom = require("jsdom").jsdom;

describe('LoglinesFragment', function() {
    var data = fs.readFileSync(__dirname+'/../app/index.html', 'utf8');
    var doc = jsdom(data);

    describe('#LoglinesFragment({document: a_dom})', function() {
        it('should initialize correctly', function() {
            var llfrag = new LoglinesFragment(doc);
            expect(llfrag).to.have.a.property('autoScroll', false);
        });
    });

});
