const vsCode = require('vscode');

var DataCapture = function() {
	this.pomoIntervalData = {};
};

DataCapture.prototype.changeFile = function(file, time, state) {
	if (this.pomoIntervalData[file] === undefined) {
		let objState = {};
		objState[state] = time;
		this.pomoIntervalData[file] = objState;
	} else {
		this.pomoIntervalData[file][state] =
			this.pomoIntervalData[file][state] === undefined
				? time
				: (this.pomoIntervalData[file][state] += time);
	}
	console.log(this.pomoIntervalData);
};

exports.DataCapture = DataCapture;
