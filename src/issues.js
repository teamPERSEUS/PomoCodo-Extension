const vsCode = require('vscode');
const { nextIssue } = require('./command');
const { convertSec } = require('./convertTime');

var Issues = function(newIssues) {
	this.name = Issues;
	this.issues = newIssues;
	this.state = 0;
	this.currentIssue = this.issues[this.state];
	this.issuesIndex = this.issues.length - 1;
	this.statusBarItem = vsCode.window.createStatusBarItem(
		vsCode.StatusBarAlignment.left
	);
	this.statusBarItem.command = nextIssue;
	this.statusBarItem.show();
	this.updateStatusBar();
};

Issues.prototype.updateStatusBar = function() {
	this.statusBarItem.text =
		this.currentIssue.title +
		' - ' +
		convertSec(this.currentIssue.estimate_time) +
		' hours';
};

Issues.prototype.nextIssue = function() {
	if (this.state === this.issuesIndex) {
		this.state = 0;
	} else {
		this.state++;
	}

	this.currentIssue = this.issues[this.state];
	this.updateStatusBar();
};

exports.Issues = Issues;
