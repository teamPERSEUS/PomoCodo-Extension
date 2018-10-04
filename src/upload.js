let request = require('request');

var upload = function () {
  request("http://localhost:1337/vsCode", { method: 'POST', form: { data: "test" }, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' } }
  )
}

exports.upload = upload;