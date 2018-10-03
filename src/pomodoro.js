const vsCode = require('vscode');
const command = require('./command');
const timerStates = require('./timerStates');
const convertTime = require('./milliconvert');
const defaultTime = 1500000; //25 minutes
const MILLISECONDS_IN_SECOND = 1000;

exports.Pomocodo = function() {
  this.pomoInterval === defaultTime;
  this.milliSecRemaining = this.pomoInterval;
  this.timeout = 0;
  this.date = new Date();
  this.interval = 0;
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
  let secondsPassed = () => {
    this.milliSecRemaining -= MILLISECONDS_IN_SECOND;
    this.updateStatusBar();
  };

  this.endDate = new Date(Date.now().valueOf() + this.milliSecRemaining);
  this.timeout = setTimeout(onExpired, this.milliSecRemaining);
  this.interval = setInterval(secondsPassed, MILLISECONDS_IN_SECOND);
  this.setState(timerStates.timerState.RUNNING, command.pausePomodoro);
  return true;
};

Pomocodo.prototype.stop = function() {
  if (!timerStates.stopStates.has(this.state)) return false;

  clearTimeout(this.timeout);
  clearInterval(this.interval);

  this.timeout = 0;
  this.interval = 0;
  this.milliSecRemaining = 0;
  this.setState(timerStates.timerState.FINISHED, command.startPomodoro);
};

Pomocodo.prototype.pause = function() {
  if (!this.state === 'PAUSED') return false;

  clearTimeout(this.timeout);
  clearInterval(this.interval);
  this.setState(timerStates.timerState.PAUSED, command.startPomodoro);
  return true;
};

Pomocodo.prototype.restart = function() {
  this.stop();
  this.milliSecRemaining = this.pomoInterval;
  this.setState(timerStates.timerState.READY, command.startPomodoro);
};

Pomocodo.prototype.dispose = function() {
  if (this.statusBarItem) {
    this.statusBarItem.hide();
    this.statusBarItem.dispose();
    this.statusBaritem = null;
  }
  this.state = timerStates.timerState.DISPOSED;
};
