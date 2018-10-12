// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vsCode = require('vscode');
const pomocodo = require('./pomocodo');
const command = require('./command');
// const rp = require('request-promise');

// async function getUserRepoISsues() {
// 	const gitUserId = await vsCode.window.showInputBox({
// 		userName: 'Enter your github UserID'
// 	});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
	const PomocodoTimer = new pomocodo.Pomocodo();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test" is now active!');
	// console.log(context);
	let dataCapture = false;
	let start = vsCode.commands.registerCommand(command.startPomocodo, () => {
		PomocodoTimer.startTimer();
	});
	let pause = vsCode.commands.registerCommand(command.pausePomocodo, () => {
		PomocodoTimer.pause();
	});
	let reset = vsCode.commands.registerCommand(command.resetPomocodo, () => {
		PomocodoTimer.restart();
	});
	let nextIssue = vsCode.commands.registerCommand(command.nextIssue, () => {
		PomocodoTimer.changeIssue();
		PomocodoTimer.issue.nextIssue();
	});
	let changeDoc = vsCode.window.onDidChangeActiveTextEditor(e => {
		PomocodoTimer.commitDataOnFileChange();
		PomocodoTimer.timeSpentonFile = 1;
		PomocodoTimer.activeFile = e.document.fileName;
	});
	context.subscriptions.push([start, pause, reset, nextIssue, changeDoc]);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	PomocodoTimer.dispose();
	Issue.dispose();
}
exports.deactivate = deactivate;
exports.PomocodoTimer = PomocodoTimer;
