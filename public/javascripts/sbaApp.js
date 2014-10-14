var app = angular.module('sbaApp', ['leaflet-directive', 'angucomplete', 'census', 'angular-data.DSCacheFactory']);
app.run(function ($http, DSCacheFactory) {
    DSCacheFactory('defaultCache', {
        storage: 'localStorage'
    });
    $http.defaults.cache = DSCacheFactory.get('defaultCache');
});

app.controller('SbaController', ['$scope', '$http', 'leafletData', 'demographics', function($scope, $http, leafletData, demographics) {
	var defaultStyle = {
		weight: 1.5,
		color: '#55A',
		fillColor: '#99F'
	}, lastLayer = false;

	angular.extend($scope, {
		mapCenter: {
			lat: 42.3581,
			lng: -71.0636,
			zoom: 12
		},
		selectedLocation: {}
	});
	function getGeoJson(geoId, getChildren) {
		$http.get('http://api.censusreporter.org/1.0/geo/show/tiger2012?geo_ids=140|' + geoId).success(function(data, status) {
			angular.extend($scope, {
				geoJson: {
					data: data,
					style: defaultStyle
				}
			});
			var layer = L.geoJson();
			layer.addData(data);
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
	
	$scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
		if (lastLayer) {
			lastLayer.setStyle(defaultStyle);
		}
		var layer = leafletEvent.target;
		layer.setStyle({
			weight: 2,
			color: '#900',
			fillColor: 'red'
		});
		layer.bringToFront();
		lastLayer = layer;
		demographics.getDemographics(featureSelected.properties.geoid).then(function(data) {
			$scope.demographics = data;
		});
	});

	$scope.$watch('selectedLocation', function() {
		if ($scope.selectedLocation
			&& $scope.selectedLocation.originalObject
			&& $scope.selectedLocation.originalObject.full_geoid) {
			getGeoJson($scope.selectedLocation.originalObject.full_geoid);
		}
	});
}]);