const vsCode = require('vscode');

var DataCapture = function() {
	this.pomoIntervalData = {};
};

DataCapture.prototype.update = function(document) {
	if (this.pomoIntervalData[document] === undefined) {
		this.pomoIntervalData[document] = 2;
	} else {
		this.pomoIntervalData[document]++;
	}
	console.log(this.pomoIntervalData[document]);
};

exports.DataCapture = DataCapture;
