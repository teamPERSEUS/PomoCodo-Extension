// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const pomocodo = require('./pomocodo');
const command = require('./command');
const PomocodoTimer = new pomocodo.Pomocodo();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "test" is now active!');

  let start = vscode.commands.registerCommand(command.startPomocodo, () => {
    PomocodoTimer.start;
  });
  let pause = vscode.commands.registerCommand(command.pausePomocodo, () => {
    PomocodoTimer.pause();
  });
  let reset = vscode.commands.registerCommand(command.resetPomocodo, () => {
    PomocodoTimer.restart();
  });

  context.subscriptions.push([start, pause, reset]);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
  PomocodoTimer.dispose();
}
exports.deactivate = deactivate;
