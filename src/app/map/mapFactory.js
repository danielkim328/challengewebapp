/** Map Service
*** Methods to create maps and markers and iteract with maps
**/

angular.module( 'appMain.mapFactory', [])

.factory('Map', function() {
	'use strict';

	function Map(){
		this.map = null;
		this.markers = [];
		this.infoWindow = null;
	}

	Map.prototype = {
		instantiate: function(htmlId){
			var mapOptions = {
				zoom: 4,
				center: new google.maps.LatLng(40.0000, -98.0000),
				mapTypeId: google.maps.MapTypeId.TERRAIN
			};
			this.map = new google.maps.Map(document.getElementById(htmlId), mapOptions);
			this.infoWindow = new google.maps.InfoWindow();
		},

		createMarker: function (info){
			var marker = new google.maps.Marker({
				map: this.map,
				position: new google.maps.LatLng(info.latitude, info.longitude),
				title: info.name
			});
			marker.content = '<div class="infoWindowContent">' + info.created_at + '</div>';
			google.maps.event.addListener(marker, 'click', function(){
				infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
				infoWindow.open(this.map, marker);
			});
			return marker;
		},

		openInfoWindow: function(e, selectedMarker){
			e.preventDefault();
			google.maps.event.trigger(selectedMarker, 'click');
		},

		updateMarkers: function(data){
			this.clearMarkers();
			_.each(data, function(location){
				this.markers.push(this.createMarker(location));
			}, this);
		},

		clearMarkers: function(data){
			// Sets the map on all markers in the array.
			for (var i = 0; i < this.markers.length; i++) {
				this.markers[i].setMap(null);
			}
			this.markers = [];
		}
	};

	return Map;

});

