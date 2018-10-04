let request = require('request');

var uplad = function () {
  request("http://localhost:10345/", { method: 'POST', form: data, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' } }
  )
}

