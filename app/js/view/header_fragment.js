
function HeaderFragment(myDocument) {
	this.dissectorDropdown = myDocument.querySelector(".header .dissector-control");
	this.dissectorDropdownList = myDocument.querySelector(".header .dissector-control ul");
}

HeaderFragment.prototype.addDissectors = function(dissectors) {
	this.dissectorDropdownList.innerHTML = dissectors.reduce(function(p, c) {
		return p+'<li><a href="#">'+c+'</a></li>'
	}, "");
};

module.exports = HeaderFragment;
