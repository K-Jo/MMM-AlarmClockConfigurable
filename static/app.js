var app = angular.module("alarmclock", []);

var AlarmController = function($scope, $http) {

  $scope.alarmStatus = false;
  $scope.alarmTime = new Date('01/01/1970 07:05:00');

  $scope.toggleAlarm = function() {
    $http.post("http://bedroompi:8001/alarm/status", "")
        .then(function (response) {
            getStatus();
        });
  }

  var getStatus = function(){
    $http.get("http://bedroompi:8001/alarm/status")
      .then(function (response) {
          console.log(response.data);
          $scope.alarmStatus = response.data;
      });
  }

  $scope.saveAlarm = function() {
    $http.post("http://bedroompi:8001/alarm/time/" + $scope.alarmTime.getHours() + "/" + $scope.alarmTime.getMinutes(), "")
        .then(function (response) {
            getTime();
        });
  };

  var getTime = function(){
    $http.get("http://bedroompi:8001/alarm/time/next")
      .then(function (response) {
          $scope.alarmTime = new Date("01/01/1970 " + response.data.time + ":00");
          console.log($scope.alarmTime);
      });
  }

  getStatus();
  getTime();

}
app.controller("AlarmController", AlarmController);
