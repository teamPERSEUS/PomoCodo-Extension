const timerState = {
	NULL: 'null',
	READY: 'ready',
	RUNNING: 'running',
	PAUSED: 'paused',
	FINISHED: 'finished',
	DISPOSED: 'disposed',
	BREAK: 'break!'
};

exports.timerState = timerState;

exports.states = new Set([
	timerState.NULL,
	timerState.READY,
	timerState.RUNNING,
	timerState.PAUSED,
	timerState.FINISHED,
	timerState.DISPOSED,
	timerState.BREAK
]);
exports.startStates = new Set([
	timerState.FINISHED,
	timerState.READY,
	timerState.PAUSED,
	timerState.BREAK
]);
exports.stopStates = new Set([
	timerState.RUNNING,
	timerState.PAUSED,
	timerState.BREAK
]);
