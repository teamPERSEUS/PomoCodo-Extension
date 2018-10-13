const vsCode = require('vscode');
const command = require('./command');
const timerStates = require('./timerStates');
const convertTime = require('./convertTime');
const DataCapture = require('./dataCapture');
const sendData = require('./upload');
const issues = require('./issues');
const defaultTime = 5000; //25 minutes
const defaultBreak = 2000;
const longBreak = 6000;
const MILLISECONDS_IN_SECOND = 1000;
const wordCount = 10;

var Pomocodo = function(pomoInterval = defaultTime) {
	this.name = 'Pomocodo';
	// this.data = new DataCapture.DataCapture();
	// this.timeSpentonFile = 1;
	// this.activeFile = vsCode.window.activeTextEditor.document.fileName;
	// this.issue = new issues.Issues();
	// this.pomoInterval = defaultTime;
	// this.completed = 0;
	// this.milliSecRemaining = this.pomoInterval;
	// this.timeout = 0;
	// this.date = new Date();
	// this.interval = 0;
	this.break = false;
	this.state = timerStates.timerState.READY;
	this.statusBarItem = vsCode.window.createStatusBarItem(
		vsCode.StatusBarAlignment.Left,
		Number.MAX_SAFE_INTEGER
	);
	this.statusBarItem.command = command.startPomocodo;
	this.statusBarItem.show();
	this.updateStatusBar();
};

Pomocodo.prototype.updateStatusBar = function() {
	const button =
		timerStates.timerState.READY === this.state
			? `$(primitive-square)`
			: `$(clock)`;
	this.statusBarItem.text =
		button +
		' ' +
		convertTime.convert(this.milliSecRemaining) +
		' - ' +
		this.state +
		'  rounds completed : ' +
		this.completed;
};

Pomocodo.prototype.setState = function(state, statusCommand) {
	this.state = state;
	this.statusBarItem.command = statusCommand;
	this.updateStatusBar();
};

Pomocodo.prototype.start = function() {
	// if (!timerStates.startStates.has(this.state)) return false;

	let onExpired = () => {
		let file = this.activeFile;
		let time = this.timeSpentonFile;
		let state = this.state;
		let issue = this.issue.currentIssue.IssueName;
		this.break = !this.break;
		this.commitDataOnFileChange(file, time, state, issue);
		this.restart();

		let message;
		if (this.break) {
			message = 'Round completed! Make sure to take a break :)';
		} else {
			message = 'next round, start!';
		}
		vsCode.window.showInformationMessage(message);
	};
	let secondsPassed = () => {
		this.milliSecRemaining -= MILLISECONDS_IN_SECOND;
		this.updateStatusBar();
		this.timeSpentonFile++;
	};
	this.timeSpentonFile = 1;
	this.timeout = setTimeout(onExpired, this.milliSecRemaining);
	this.interval = setInterval(secondsPassed, MILLISECONDS_IN_SECOND);
	if (this.break) {
		this.setState(timerStates.timerState.BREAK, command.pausePomocodo);
	} else {
		this.setState(timerStates.timerState.READY, command.pausePomocodo);
	}
	return true;
};

Pomocodo.prototype.stop = function() {
	// if (!timerStates.stopStates.has(this.state)) return false;

	clearTimeout(this.timeout);
	clearInterval(this.interval);

	this.timeout = 0;
	this.interval = 0;
	this.milliSecRemaining = 0;
	this.setState(timerStates.timerState.FINISHED, command.startPomocodo);
};

Pomocodo.prototype.pause = function() {
	// if (!timerStates.pauseStates.has(this.state)) return false;
	clearTimeout(this.timeout);
	clearInterval(this.interval);
	this.setState(timerStates.timerState.PAUSED, command.startPomocodo);
	return true;
};

Pomocodo.prototype.restart = function() {
	if (this.break) {
		this.stop();
		if (this.completed > 0 && this.completed % 4 === 0) {
			this.milliSecRemaining = longBreak;
		} else {
			this.milliSecRemaining = defaultBreak;
		}
		this.start();
	}
	if (this.break === false) {
		this.stop();
		this.completed++;
		sendData.upload(this.completed, this.data.pomoIntervalData);
		this.milliSecRemaining = this.pomoInterval;
		this.start();
	}
};

Pomocodo.prototype.commitDataOnFileChange = function(file, time, state, issue) {
	this.data.changeFile(file, time, state, issue, wordCount);
};

Pomocodo.prototype.dispose = function() {
	if (this.statusBarItem) {
		this.statusBarItem.hide();
		this.statusBarItem.dispose();
		this.statusBaritem = null;
	}
	this.state = timerStates.timerState.DISPOSED;
};

exports.Pomocodo = Pomocodo;
