const vsCode = require('vscode');

var DataCapture = function() {
	this.pomoIntervalData = {};
};

DataCapture.prototype.captureData = function(
	issue,
	file,
	state,
	time,
	wordCount
) {
	console.log(file);
	if (
		this.pomoIntervalData[issue] === undefined ||
		this.pomoIntervalData[issue][file] === undefined ||
		this.pomoIntervalData[issue][file][state] === undefined
	) {
		if (this.pomoIntervalData[issue] === undefined) {
			this.pomoIntervalData[issue] = {};
		}
		if (this.pomoIntervalData[issue][file] === undefined) {
			this.pomoIntervalData[issue][file] = {};
		}
		if (this.pomoIntervalData[issue][file][state] === undefined) {
			this.pomoIntervalData[issue][file][state] = {};
		}
		let stateObj = {
			time: time,
			wordCount: wordCount
		};
		this.pomoIntervalData[issue][file][state] = stateObj;
	} else {
		let stateTime = this.pomoIntervalData[issue][file][state].time;
		this.pomoIntervalData[issue][file][state].time =
			stateTime === undefined ? time : (stateTime += time);
		let stateWordCount = this.pomoIntervalData[issue][file][state].wordCount;
		this.pomoIntervalData[issue][file][state].wordCount =
			stateWordCount === undefined ? wordCount : (stateWordCount += wordCount);
	}
	// console.log(this.pomoIntervalData);
};

exports.DataCapture = DataCapture;
