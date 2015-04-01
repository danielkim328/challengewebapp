angular.module( 'appMain.map', [
	'ui.router',
	'placeholders',
	'ui.bootstrap',
	'appMain.mapFactory'
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

.controller( 'MapCtrl', function MapCtrl( $scope, $http, API_ENDPOINTS, Map ) {

	// Default UI Settings
	$scope.limit = 1;
	$scope.type = "Top Net Income";

	// Map Instance
	var MapInstance = new Map();

	// Create Goole Map
	MapInstance.instantiate('map-canvas');
	
	// Function to make call to maps API for location info and update the map with new markers 
	$scope.update = function(){
		
		// Set Base Url
		var url = API_ENDPOINTS.MAPS;
		var queryStrings = [];

		// Generate Query String
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

		// Make API Call
		$http.get(url).
			success(function(data, status, headers, config) {

				// Update Markers
				MapInstance.updateMarkers(data);

			}).
			error(function(data, status, headers, config) {

				console.log('error with maps api');

			});
		};

		// Populate map as Default
		$scope.update();
});
