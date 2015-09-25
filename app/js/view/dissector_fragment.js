
function DissectorFragment(myDocument) {
	this.content = myDocument.querySelector(".dissector-fragment ul");
}

DissectorFragment.prototype.appendEvent = function(event) {
	if (event.title)
		this.content.innerHTML += this.genTitledEvent(event);
	else
		this.content.innerHTML += this.genSimpleEvent(event);
};
DissectorFragment.prototype.reset = function() {
	this.content.innerHTML = "";
};

DissectorFragment.prototype.genTitledEvent = function(event) {
	return (
	'<li class="event" style="background: '+event.color+'">'+
		'<div class="title" style="background: '+event.title_color+'">'+event.title+'</div>'+
		'<div class="contents">'+
			event.labels.reduce(function(p, c) {
				return p+'<p id="'+c.id+'">'+c.label+'</p>';
			}, "") +
		'</div>' +
	'</li>');
};
DissectorFragment.prototype.genSimpleEvent = function(event) {
	return (
	'<li class="event" style="background: '+event.color+'">'+
			'<p>'+event.label+'</p>'+
	'</li>');
};

module.exports = DissectorFragment;
