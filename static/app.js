var app = angular.module("alarmclock", []);

var AlarmController = function($scope) {
  $scope.saveAlarm = function() {
    console.log($scope.alarmStatus);
    console.log($scope.alarmTime.getHours());
    console.log($scope.alarmTime.getMinutes());
  };

  
}
app.controller("AlarmController", AlarmController);
