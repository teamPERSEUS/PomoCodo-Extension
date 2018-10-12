const vsCode = require('vscode');
const {
	startPomocodo,
	pausePomocodo,
	resetPomocodo,
	nextIssue
} = require('./command');
const { convert } = require('./convertTime');
const { DataCapture } = require('./dataCapture');
const { upload } = require('./upload');
const { Issues } = require('./issues');
const oneSecond = 1000;
const wordCount = 10;

class Pomocodo {
	constructor() {
		this.data = new DataCapture();
		this.issue = new Issues();
		this.completed = 0;
		this.activeFile = vsCode.window.activeTextEditor.document.fileName;
		this.timeSpent = 1;
		this.pomoInterval = 10000;
		this.shortBreak = 8000;
		this.longBreak = 3000;
		this.remainingTime = this.pomoInterval;
		this.timeout = 0;
		this.interval = 0;
		this.state = 'Ready';
		this.statusBarItem = vsCode.window.createStatusBarItem(
			vsCode.StatusBarAlignment.Left,
			Number.MAX_SAFE_INTEGER
		);
		this.statusBarItem.command = startPomocodo;
		this.statusBarItem.show();
		this.updateStatusBar();
	}
	updateStatusBar() {
		const button =
			this.state === 'Ready' || this.state === 'Paused'
				? `$(triangle-right)`
				: `$(clock)`;
		this.statusBarItem.text =
			button +
			' ' +
			convert(this.remainingTime) +
			' ' +
			this.state +
			'   Intervals completed : ' +
			this.completed;
	}

	updateState(state, command) {
		this.state = state;
		this.statusBarItem.command = command;
		this.updateStatusBar();
	}

	startTimer() {
		let secondPassed = () => {
			this.remainingTime -= oneSecond;
			this.updateStatusBar();
			this.timeSpent++;
		};
		let timesUp = () => {
			clearTimeout(this.timeout);
			clearInterval(this.interval);
			this.timeout = 0;
			this.interval = 0;
			this.remainingTime = 0;
			this.data.captureData(
				this.issue.currentIssue.IssueName,
				this.activeFile,
				this.state,
				this.timeSpent,
				10
			);
			this.timeSpent = 0;
			this.restart();
		};
		if (this.state === 'Ready') {
			this.updateState('Running', pausePomocodo);
		}
		this.timeout = setTimeout(timesUp, this.remainingTime);
		this.interval = setInterval(secondPassed, oneSecond);
	}

	restart() {
		this.state === 'Running'
			? (this.updateState('Break', pausePomocodo),
			  (this.remainingTime = this.pomoInterval))
			: (this.updateState('Running', pausePomocodo),
			  (this.remainingTime = this.shortBreak),
			  this.completed++);

		this.startTimer();
	}

	pause() {
		clearTimeout(this.timeout);
		clearInterval(this.interval);
		this.updateState('Paused', startPomocodo);
	}

	changeIssue() {
		clearTimeout(this.timeout);
		clearInterval(this.interval);
		this.data.captureData(
			this.issue.currentIssue.IssueName,
			this.activeFile,
			this.state,
			this.timeSpent,
			10
		);
		this.timeSpent = 0;
		this.startTimer();
	}
	dispose() {
		if (this.statusBarItem) {
			this.statusBarItem.hide();
			this.statusBarItem.dispose();
			this.statusBaritem = null;
		}
	}
}

exports.Pomocodo = Pomocodo;
