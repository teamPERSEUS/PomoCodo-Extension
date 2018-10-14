const vsCode = require('vscode');
const { startPomocodo, pausePomocodo, resetPomocodo } = require('./command');
const { convert } = require('./convertTime');
const { DataCapture } = require('./dataCapture');
const { upload } = require('./upload');
const { Issues } = require('./issues');
const oneSecond = 1000;
const wordCount = 10;

class Pomocodo {
	constructor(gitUserId, gitRepo, newIssues, gitID) {
		this.gitId = gitID;
		this.userId = gitUserId;
		this.gitRepoUrl = gitRepo;
		this.data = new DataCapture();
		this.issue = new Issues(newIssues);
		this.activeFile =
			vsCode.window.activeTextEditor === undefined
				? 'No Active Document'
				: vsCode.window.activeTextEditor.document;
		this.startingWordCount =
			this.activefile === 'No Active Document' ? 0 : this.getWordCount();
		this.wordCounter = 0;
		this.lastSecWordCount = 0;
		this.idleDefault = 3;
		this.idleTime = this.idleDefault + 1;
		this.idleCountDown = this.idleDefault;
		this.completed = 0;
		this.timeSpent = 1;
		this.pomoInterval = 20000;
		this.shortBreak = 4000;
		this.longBreak = 4000;
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

	idleChecker(currentWordCount) {
		if (this.idleCountDown === 0) {
			this.idleTime += 1;
		}
		if (currentWordCount - this.lastSecWordCount === 0) {
			if (this.idleCountDown > 0) this.idleCountDown -= 1;
		} else {
			this.idleCountDown = this.idleDefault;
		}
		this.lastSecWordCount = currentWordCount;
	}

	getWordCount() {
		if (this.activeFile === 'No Active Document') {
			return 0;
		}
		let doc = this.activeFile;

		let docContent = doc.getText();
		docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
		docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		let wordCount = 0;
		if (docContent !== '') {
			wordCount = docContent.split(' ').length;
		}
		return wordCount;
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
			let currentWordCount = this.getWordCount();
			this.wordCounter = currentWordCount - this.startingWordCount;
			this.idleChecker(currentWordCount);
			this.remainingTime -= oneSecond;
			this.updateStatusBar();
			this.timeSpent++;
		};
		let timesUp = () => {
			clearTimeout(this.timeout);
			clearInterval(this.interval);
			console.log(this.idleTime + 'timeup');
			this.timeout = 0;
			this.interval = 0;
			this.remainingTime = 0;
			this.captureData();
			this.wordCounter = 0;
			this.idleTime = this.idleDefault + 1;
			this.idleCountDown = this.idleDefault;
			this.startingWordCount = this.getWordCount();
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
			upload(
				this.completed,
				this.data.pomoIntervalData,
				this.gitId,
				this.userId,
				this.gitRepoUrl
			);
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
		if (this.state != 'Ready')
			this.data.captureData(
				this.issue.currentIssue.title,
				this.activeFile.fileName,
				this.state,
				this.timeSpent,
				this.wordCounter
			);
	}
	changeIssue() {
		// clearTimeout(this.timeout);
		// clearInterval(this.interval);
		console.log(this.idleTime + 'changeIssue');
		this.wordCounter = 0;
		this.idleTime = this.idleDefault + 1;
		this.idleCountDown = this.idleDefault;
		this.startingWordCount = this.getWordCount();
		if (this.state !== 'Ready') this.captureData();
		this.timeSpent = 0;
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
