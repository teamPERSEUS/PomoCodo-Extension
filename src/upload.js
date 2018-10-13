let request = require('request');

var upload = function(interval, data, gitId, userId, gitRepoUrl) {
	console.log(interval, data, gitId, userId, gitRepoUrl);
	request('http://localhost:4001/interval', {
		method: 'POST',
		body: JSON.stringify({
			interval: interval,
			data: data,
			gitId: gitId,
			userId: userId,
			gitRepoUrl: gitRepoUrl
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

exports.upload = upload;
