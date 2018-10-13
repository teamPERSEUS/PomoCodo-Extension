var convert = function(milliseconds) {
	let MILLISECONDS_IN_SECOND = 1000;
	let SECONDS_IN_MINUTE = 60;

	let totalSec = Math.round(milliseconds / MILLISECONDS_IN_SECOND);
	let minutes = Math.floor(totalSec / SECONDS_IN_MINUTE);
	let seconds = Math.floor(totalSec - minutes * SECONDS_IN_MINUTE);

	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}

	return minutes + ':' + seconds;
};

var convertSec = function(totalSeconds) {
	var hours = Math.floor(totalSeconds / 3600);
	var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
	var seconds = totalSeconds - hours * 3600 - minutes * 60;

	seconds = Math.round(seconds * 100) / 100;

	var result = hours === 1 ? hours + ' hour ' : hours + ' hours ';
	result += minutes === 1 ? minutes + ' minute  ' : minutes + ' minutes  ';
	return result;
};

module.exports = {
	convertSec,
	convert
};
