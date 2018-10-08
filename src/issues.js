const vsCode = require('vscode');
const command = require('./command');

var Issues = function() {
	this.name = Issues;
	this.issues = [
		{
			IssueName: 'fix ALL the bugs ',
			plan: 4
		},
		{
			IssueName: 'refractor all the bugs',
			plan: 4
		}
	];
	this.state = 0;
	this.issuesIndex = this.issues.length - 1;
	this.statusBarItem = vsCode.window.createStatusBarItem(
		vsCode.StatusBarAlignment.left
	);
	this.statusBarItem.command = command.nextIssue;
	this.statusBarItem.show();
	this.updateStatusBar();
};

Issues.prototype.updateStatusBar = function() {
	let item = this.issues[this.state];
	this.statusBarItem.text = item.IssueName + ' - ' + item.plan + ' hours';
};

Issues.prototype.nextIssue = function() {
	console.log(this.state + '    ' + this.issuesIndex);
	if (this.state === this.issuesIndex) {
		this.state = 0;
	} else {
		this.state++;
	}
	this.updateStatusBar();
};

exports.Issues = Issues;
