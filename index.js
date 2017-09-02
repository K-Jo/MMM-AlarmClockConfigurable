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
var alarmStatus = false;
var hours = 7;
var minutes = 5;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/alarm/status', function (req, res) {
  res.send(alarmStatus)
})

app.post('/alarm/status/', function (req, res) {
  alarmStatus = !alarmStatus;
  res.send("ok");
});

app.get('/alarm/time/next', function (req, res) {
  var nextAlarm = {
          time:  hours + ":" + minutes,
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
          message: "Get your sweet ass out of bed!"
  };
  res.send(nextAlarm);
});

app.post('/alarm/time/:hours/:minutes', function (req, res) {
  hours = req.params.hours;
  minutes = req.params.minutes;
  res.send("ok");
});


app.listen(8001)
