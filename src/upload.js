let request = require('request');

var upload = function(interval, data, userId, gitRepoUrl, idleTime) {
	// console.log(interval, data, gitId, userId, gitRepoUrl);
	request('http://localhost:4001/interval', {
		method: 'POST',
		body: JSON.stringify({
			interval: interval,
			data: data,
			userId: userId,
			gitRepoUrl: gitRepoUrl,
			idleTime: idleTime
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

exports.upload = upload;
