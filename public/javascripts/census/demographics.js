angular.module('census', ['census.aggregate'])
	.factory('demographics', ['$http', '$q', 'ageAggregator', function($http, $q, ageAggregator) {
		var tableId = 'B01001';
		return {
			getDemographics: function(geoId) {
				var deferred = $q.defer();
				$http.get('http://api.censusreporter.org/1.0/data/show/latest?table_ids=' + tableId + '&geo_ids=' + geoId)
					.success(function(data, status) {
						var estimate = data.data[geoId][tableId].estimate;
						deferred.resolve(ageAggregator.aggregate(estimate));
				});
				return deferred.promise;
			}
		}
	}]);
