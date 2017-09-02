var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var express = require('express')

var serve = serveStatic("./static");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(8000);


var app = express()
var alarm = false;

app.get('/status', function (req, res) {
  res.send(alarm)
})

app.listen(8001)
