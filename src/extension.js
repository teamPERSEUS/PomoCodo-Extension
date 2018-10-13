// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vsCode = require('vscode');
const { Pomocodo } = require('./pomocodo');
const command = require('./command');
const rp = require('request-promise');

// async function getUserRepoISsues() {
// 	const gitUserId = await vsCode.window.showInputBox({
// 		userName: 'Enter your github UserID'
// 	});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test" is now active!');
	// console.log(context);
	async function getUserRepoISsues() {
		const gitUserId = await vsCode.window.showInputBox({
			placeHolder: 'Enter your github UserID'
		});
		const gitRepo = await vsCode.window.showInputBox({
			placeHolder: 'Enter your github repo'
		});
		const options = {
			method: 'POST',
			uri: 'http://localhost:4000/api/plannedIssues',
			headers: {
				'User-Agent': 'Request-Promise'
			},
			body: {
				user: gitUserId,
				url: gitRepo
			},
			json: true
		};
		rp(options)
			.then(data => {
				if (data === 'false') {
					return;
				} else {
					let newIssues = [
						{
							title: 'No Issue Selected',
							estimate_time: 0
						}
					].concat(data);
					let gitID = data[1].git_id;

					const PomocodoTimer = new Pomocodo(
						gitUserId,
						gitRepo,
						newIssues,
						gitID
					);

					let start = vsCode.commands.registerCommand(
						command.startPomocodo,
						() => {
							PomocodoTimer.startTimer();
						}
					);
					let pause = vsCode.commands.registerCommand(
						command.pausePomocodo,
						() => {
							PomocodoTimer.pause();
						}
					);
					let reset = vsCode.commands.registerCommand(
						command.resetPomocodo,
						() => {
							PomocodoTimer.restart();
						}
					);
					let nextIssue = vsCode.commands.registerCommand(
						command.nextIssue,
						() => {
							PomocodoTimer.changeIssue();
							PomocodoTimer.issue.nextIssue();
						}
					);
					let changeDoc = vsCode.window.onDidChangeActiveTextEditor(e => {
						PomocodoTimer.commitDataOnFileChange();
						PomocodoTimer.timeSpentonFile = 1;
						PomocodoTimer.activeFile = e.document.fileName;
					});
					context.subscriptions.push([
						start,
						pause,
						reset,
						nextIssue,
						changeDoc
					]);
				}
			})
			.catch(err => {
				console.log(err);
			});
		exports.PomocodoTimer = PomocodoTimer;
	}

	getUserRepoISsues();
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	// PomocodoTimer.dispose();
	// Issue.dispose();
}
exports.deactivate = deactivate;
