var app = angular.module('sbaApp', ['leaflet-directive', 'angucomplete', 'census']);
app.controller('SbaController', ['$scope', '$http', 'leafletData', 'demographics', function($scope, $http, leafletData, demographics) {
	angular.extend($scope, {
		mapCenter: {
			lat: 42.3581,
			lng: -71.0636,
			zoom: 12
		},
		selectedLocation: {},
		getGeoJson: function(geoId) {
			$http.get('http://api.censusreporter.org/1.0/geo/tiger2012/' + geoId + '?geom=true').success(function(data, status) {
				angular.extend($scope, {
					geoJson: {
						data: data
					}
				});
				var layer = L.geoJson();
				layer.addData({type: 'FeatureCollection', features: [ data ]});
				leafletData.getMap().then(function(map) {
					map.fitBounds(layer);
				});
			});
			demographics.getDemographics(geoId).then(function(data) {
				angular.extend($scope, {
					demographics: data
				});
			});
		}
	});
	$scope.$watch('selectedLocation', function() {
		if ($scope.selectedLocation
			&& $scope.selectedLocation.originalObject
			&& $scope.selectedLocation.originalObject.full_name) {
			$scope.getGeoJson($scope.selectedLocation.originalObject.full_geoid);
		}
	});
}]);