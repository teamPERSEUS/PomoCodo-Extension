exports.timerState = {
  NULL: 'NULL',
  READY: 'READY',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  DISPOSED: 'DISPOSED'
};

exports.states = new set([
  timerState.NULL,
  timerState.READY,
  timerState.RUNNING,
  timerState.PAUSED,
  timerState.FINISHED,
  timerState.DISPOSED
]);
exports.startStates = new Set([
  timerState.FINISHED,
  timerState.READY,
  timerState.PAUSED
]);
exports.stopStates = new Set([timerState.RUNNING, timerState.PAUSED]);
