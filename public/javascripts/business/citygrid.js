angular.module('business', [])
	.factory('citygrid', ['$http', '$q', function($http, $q) {
			var baseUrl = 'http://api.citygridmedia.com/content/places/v2/search/latlon';
			return {
				getBusinesses: function( bounds, category ) {
					var deferred = $q.defer();
					$http( {
						url: baseUrl,
						method: "GET",
						params: {
							lat: bounds.northEast.lat,
							lon: bounds.northEast.lng,
							lat2: bounds.southWest.lat,
							lon2: bounds.southWest.lng,
							what: category,
							publisher: 'citysearch',
							format: 'json'
						}}).success( function (data, status)  {
						console.log(data);
						var businesses = {};
						var len = data.results.locations.length;
						for (var i = 0; i < len; i++ ) {
							var biz = data.results.locations[i];
							businesses[biz.id] = {
								lat: biz.latitude,
								lng: biz.longitude,
								message: biz.name
							};
						}
						/*var simple = Array.map( data.results.locations, function( biz) {
							return {
								lat: biz.latitude,
								lng: biz.longitude,
								message: biz.name
							};
						});*/
						deferred.resolve( businesses );
					});
					return deferred.promise;
				}
			};
}]);
