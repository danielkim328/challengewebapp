angular.module( 'ngBoilerplate.map', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'map', {
    url: '/map',
    views: {
      "main": {
        controller: 'MapCtrl',
        templateUrl: 'map/map.tpl.html'
      }
    },
    data:{ pageTitle: 'Map' }
  });
})

.controller( 'MapCtrl', function MapCtrl( $scope, $http, angularLoad ) {

    $scope.limit = 1;
    $scope.type = "Top Net Income";

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        console.log('info', info);
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude),
            title: info.name
        });
        marker.content = '<div class="infoWindowContent">' + info.created_at + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    };  
    
    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };


    // uiGmapGoogleMapApi.then(function (maps) {
    //   $scope.googlemap = {};
    //   // angular map default settings
    //   $scope.map = {
    //     center: {
    //       latitude: 40.1451,
    //       longitude: -99.6680
    //     },
    //     zoom: 4,
    //     bounds: {}
    //   };
    //   $scope.options = {
    //     scrollwheel: false
    //   };
    // });

    // // marker window event handlers
    // $scope.onClick = function() {
    //     $scope.windowOptions.visible = !$scope.windowOptions.visible;
    //     console.log('this', this);
    // };

    // $scope.closeClick = function() {
    //     $scope.windowOptions.visible = false;
    // };

    $scope.update = function(){
      var url = 'http://localhost:3000/maps.json';
      var queryStrings = [];

      if ($scope.limit){
        queryStrings.push("limit="+$scope.limit);
      }

      if ($scope.type){
        switch ($scope.type){
          case "Top Earners":
            queryStrings.push("transaction_type=earnings_only");
            break;
          case "Top Spenders":
            queryStrings.push("transaction_type=charges_only");
            break;
          case "Top Net Income":
            break;
          default:
            break;
        }
      }

      if (queryStrings.length > 0){
        url = url + "?" + queryStrings.join('&');
      }

      $http.get(url).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          updateMarkers(data);
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    };

    function updateMarkers(data){
      clearMarkers();
      _.each(data, function(location){
        createMarker(location);
      });
    }

    function clearMarkers(){
      // Sets the map on all markers in the array.
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(null);
      }
      $scope.markers = [];
    }

    $scope.update();
});
