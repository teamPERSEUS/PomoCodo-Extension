const vsCode = require('vscode');

var DataCapture = function() {
	this.pomoIntervalData = {};
};

DataCapture.prototype.changeFile = function(file, time, state) {
	console.log('file ' + file, 'time ' + time, 'state ' + state);
	if (this.pomoIntervalData[file] === undefined) {
		let objState = {};
		objState[state] = time;
		this.pomoIntervalData[file] = objState;
	} else {
		this.pomoIntervalData[file][state] += time;
	}
};

exports.DataCapture = DataCapture;
