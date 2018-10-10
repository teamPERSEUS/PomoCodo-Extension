const vsCode = require('vscode');

var DataCapture = function() {
	this.pomoIntervalData = {};
};

DataCapture.prototype.changeFile = function(
	file,
	time,
	state,
	issue,
	wordCount
) {
	if (
		this.pomoIntervalData[issue] === undefined ||
		this.pomoIntervalData[issue][file] === undefined
	) {
		let stateObj = {};
		stateObj[state] = {
			time: time,
			wordCount: wordCount
		};

		if (this.pomoIntervalData[issue] === undefined) {
			this.pomoIntervalData[issue] = {};
		}
		this.pomoIntervalData[issue][file] = stateObj;
	} else {
		let stateTime = this.pomoIntervalData[issue][file][state].time;
		this.pomoIntervalData[issue][file][state].time =
			stateTime === undefined ? time : (stateTime += time);
		let stateWordCount = this.pomoIntervalData[issue][file][state].wordCount;
		this.pomoIntervalData[issue][file][state].wordCount =
			stateWordCount === undefined ? wordCount : (stateWordCount += wordCount);
	}

	// if (this.pomoIntervalData[file] === undefined) {
	// 	let objState = {};
	// 	objState[state] = time;
	// 	this.pomoIntervalData[file] = objState;
	// } else {
	// 	this.pomoIntervalData[file][state] =
	// 		this.pomoIntervalData[file][state] === undefined
	// 			? time
	// 			: (this.pomoIntervalData[file][state] += time);
	// }
};

exports.DataCapture = DataCapture;
