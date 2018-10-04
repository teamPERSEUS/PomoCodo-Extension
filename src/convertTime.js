var convert = function (milliseconds) {
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

exports.convert = convert;