'use strict';

var app = angular.module('userAuth');



app.controller('navCtrl', function($scope, UserService, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
  };

  $scope.$watch(function() {
    return UserService.username;
  }, function(username) {
    $scope.username = username;
  });
});

app.controller('authCtrl', function($scope, $state, AuthService) {
  $scope.state = $state.current.name;
  $scope.submit = function(user) {
    if($scope.state === 'register') {
      // submit register form
      if(user.password !== user.password2) {
        $scope.user.password = $scope.user.password2 = '';
        alert('HEY. Passwords gotta match!');
      } else {
        AuthService.register(user)
          .then(function() {
            $state.go('home');
          }, function(err) {
            console.error(err);
          });
      }
    } else {
      // submit login form
      AuthService.login(user)
        .then(function() {
          $state.go('home');
        }, function(err) {
          console.error(err);
        });
    }
  };
});

app.controller("mapCtrl", function($scope, $state) {
  var map;
  var directionsDisplay;
  var directionsService;
  var stepDisplay;
  var markerArray = [];

  function initialize() {
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();

    // Create a map and center it on Manhattan.
    var sanFran = new google.maps.LatLng(37.773972, -122.431297);
    var mapOptions = {
      zoom: 13,
      center: sanFran
    }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();
  }

$scope.calcRoute = function(valid) {
  if(!valid) {
    return;
  }

    // First, clear out any existing markerArray
    // from previous calculations.
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create
    // a DirectionsRequest using BICYCLING directions.
    var start = $scope.editTrip.startLoc;
    var end = $scope.editTrip.endLoc;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.BICYCLING
    };

    // Route the directions and pass the response to a
    // function to create markers for each step.
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        // var warnings = document.getElementById("warnings_panel");
        // warnings.innerHTML = "" + response.routes[0].warnings + "";
        directionsDisplay.setDirections(response);
        showSteps(response);
      }
    });
  }

  function showSteps(directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    var myRoute = directionResult.routes[0].legs[0];

    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = new google.maps.Marker({
          position: myRoute.steps[i].start_point,
          map: map
        });
        attachInstructionText(marker, myRoute.steps[i].instructions);
        markerArray[i] = marker;
    }
  }

  function attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }

initialize();

});
