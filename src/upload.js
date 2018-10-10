let request = require('request');

var upload = function(interval, data) {
	request('http://localhost:4001/interval', {
		method: 'POST',
		body: JSON.stringify({ interval: interval, data: data }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	console.log(data);
};

exports.upload = upload;
