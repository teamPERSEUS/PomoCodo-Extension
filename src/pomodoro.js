const vsCode = require('vscode');
const command = require('./command');
const timerStates = require('./timerStates');
const convertTime = require('./milliconvert');
const defaultTime = 1500000; //25 minutes

var Pomocodo = function() {
  this.interval === defaultTime;
  this.milliSecRemaining = this.interval;
  this.timeout = 0;
  this.secondInterval = 0;
  this.state = timerStates.timerState.READY;
  this.statusBarItem = vsCode.window.createStatusBarItem(
    vsCode.StatusBarAlignment.Left,
    Number.MAX_SAFE_INTEGER
  );
  this.statusBarItem.command = command.startPomodoro;
  this.statusBarItem.show();
  this.updateStatusBar();
};

Pomocodo.prototype.updateStatusBar = function() {
  const button =
    timerStates.timerState.RUNNING === this.state
      ? '${primitive-square}'
      : '${clock}';
  this.statusBarItem.text =
    button + ' ' + convertTime(this.milliSecRemaining) + ' - ' + this.state;
};

Pomocodo.prototype.setState = function(state, statusCommand) {
  this.state = state;
  this.statusBarItem.command = statusCommand;
  this.updateStatusBar();
};

Pomocodo.prototype.start = function() {
  if (!timerStates.startStates.has(this.state)) return false;

  let onExpired = () => {
    this.reset();
    vsCode.window
      .showInformationMessage('Round completed! Make sure to take a break :)')
      .then(next => {
        if (next === 'Restart') {
          this.reset();
          this.start();
        }
      });
  };
};
