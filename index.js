var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var express = require('express')

// Static page serving port 8000
var serve = serveStatic("./static");
var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});
server.listen(8000);

// Alarm interface
var app = express();
var alarm = false;
var hours = 7;
var minutes = 5;

app.get('/alarm/status', function (req, res) {
  res.send(alarm)
})

app.get('/alarm/next', function (req, res) {
  var nextAlarm = {
          time: "07:10",
          days: [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7
          ],
          title: "Wake Up",
          message: "Get your sweet ass out of bed motherf*cker!"
  };
  res.send(alarm);
});

app.post('/alarm/:hours/:minutes', function (req, res) {
  hours = req.params.hours;
  minutes = req.params.minutes;
});

app.listen(8001)
