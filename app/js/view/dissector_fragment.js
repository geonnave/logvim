
function DissectorFragment(myDocument, emitter) {
	this.emitter = emitter;

	this.content = myDocument.querySelector(".dissector-fragment");

}

DissectorFragment.prototype.addTitledEvent = function(event) {
	return (
	'<li class="event">'+
		'<div class="title">'+event.title+'</div>'+
		'<div class="contents">'+
			event.labels.reduce(function(p, c) {
				return p+'<p>'+c.label+'</p>';
			}, "") +
			'<p>enter state1</p>'+
			'<p>exit state1</p>'+
			'<p>enter state2</p>'+
		'</div>' +
	'</li>');
};
DissectorFragment.prototype.addSimpleEvent = function(event) {
	return (
	'<li class="event">'+
			'<p>'+event.label+'</p>'+
	'</li>');
};

module.exports = DissectorFragment;
