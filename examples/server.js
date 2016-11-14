var chill = require('../logger');
var express = require('express');

var app = express();
var logger = chill();

app.use(chill.middleware(logger));

app.use('/', function (req, res) {
  res.send('Welcome to my app!');
});

app.listen(3000, function () {
  console.log('Listening on http://localhost:3000/'); // jshint ignore:line
});
