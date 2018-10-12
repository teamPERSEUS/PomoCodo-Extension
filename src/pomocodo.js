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
	constructor(gitUserId, gitRepo) {
		this.userId = gitUserId;
		this.gitRepo = gitRepo;
		console.log(this.userId, this.gitRepo);
		this.data = new DataCapture();
		this.issue = new Issues();
		this.completed = 0;
		this.activeFile = vsCode.window.activeTextEditor.document.fileName;
		this.timeSpent = 1;
		this.pomoInterval = 5000;
		this.shortBreak = 4000;
		this.longBreak = 2000;
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
			this.captureData();
			this.timeSpent = 0;
			this.restart();
		};
		if (this.state === 'Ready' || this.state === 'Paused') {
			this.updateState('Running', pausePomocodo);
		}
		this.timeout = setTimeout(timesUp, this.remainingTime);
		this.interval = setInterval(secondPassed, oneSecond);
	}

	restart() {
		if (this.state === 'Break') {
			this.completed++;
			upload(this.completed, this.data.pomoIntervalData);
			this.data.pomoIntervalData = {};
		}
		this.state === 'Running'
			? (this.updateState('Break', pausePomocodo),
			  (this.remainingTime = this.shortBreak))
			: (this.updateState('Running', pausePomocodo),
			  (this.remainingTime = this.pomoInterval));

		this.startTimer();
	}

	pause() {
		clearTimeout(this.timeout);
		clearInterval(this.interval);
		this.updateState('Paused', startPomocodo);
	}

	captureData() {
		this.data.captureData(
			this.issue.currentIssue.IssueName,
			this.activeFile,
			this.state,
			this.timeSpent,
			10
		);
	}

	changeIssue() {
		clearTimeout(this.timeout);
		clearInterval(this.interval);
		this.captureData();
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
