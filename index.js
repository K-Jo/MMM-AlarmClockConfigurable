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
var alarmTime = new Date('01/01/1970 07:05:00');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

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
          time:  ('0' + alarmTime.getHours()).slice(-2) + ":" + ('0' + alarmTime.getMinutes()).slice(-2),
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

app.post('/alarm/time/:time', function (req, res) {
  alarmTime = new Date("01/01/1970 " + req.params.time + ":00");
  res.send("ok");
});

app.listen(8001)
