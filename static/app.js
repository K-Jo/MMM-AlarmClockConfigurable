var app = angular.module("alarmclock", []);

var AlarmController = function($scope, $http) {

  $scope.alarmStatus = false;

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
    console.log($scope.alarmStatus);
    console.log($scope.alarmTime.getHours());
    console.log($scope.alarmTime.getMinutes());
  };

  getStatus();

}
app.controller("AlarmController", AlarmController);
