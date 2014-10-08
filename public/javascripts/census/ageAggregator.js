angular.module('census.aggregate', [])
	.factory('ageAggregator', function() {
		return {
			aggregate: function(estimate) {
				return [
							{
								name: '0-9',
								male: estimate['B01001003'] + estimate['B01001004'],
								female: estimate['B01001027'] + estimate['B01001028'],
								total: estimate['B01001003'] + estimate['B01001004'] + estimate['B01001027'] + estimate['B01001028']
							},
							{
								name: '10-19',
								male: estimate['B01001005'] + estimate['B01001006'] + estimate['B01001007'],
								female: estimate['B01001029'] + estimate['B01001030'] + estimate['B01001031'],
								total: estimate['B01001005'] + estimate['B01001006'] + estimate['B01001007'] + estimate['B01001029'] + estimate['B01001030'] + estimate['B01001031']
							},
							{
								name: '20-29',
								male: estimate['B01001008'] + estimate['B01001009'] + estimate['B01001010'] + estimate['B01001011'],
								female: estimate['B01001032'] + estimate['B01001033'] + estimate['B01001034'] + estimate['B01001035'],
								total: estimate['B01001008'] + estimate['B01001009'] + estimate['B01001010'] + estimate['B01001011'] + estimate['B01001032'] + estimate['B01001033'] + estimate['B01001034'] + estimate['B01001035']
							},
							{
								name: '30-39',
								male: estimate['B01001012'] + estimate['B01001013'],
								female: estimate['B01001036'] + estimate['B01001037'],
								total: estimate['B01001012'] + estimate['B01001013'] + estimate['B01001036'] + estimate['B01001037']
							},
							{
								name: '40-49',
								male: estimate['B01001014'] + estimate['B01001015'],
								female: estimate['B01001038'] + estimate['B01001039'],
								total: estimate['B01001014'] + estimate['B01001015'] + estimate['B01001038'] + estimate['B01001039']
							},
							{
								name: '50-59',
								male: estimate['B01001016'] + estimate['B01001017'],
								female: estimate['B01001040'] + estimate['B01001041'],
								total: estimate['B01001016'] + estimate['B01001017'] + estimate['B01001040'] + estimate['B01001041']
							},
							{
								name: '60-69',
								male: estimate['B01001018'] + estimate['B01001019'] + estimate['B01001020'] + estimate['B01001021'],
								female: estimate['B01001042'] + estimate['B01001043'] + estimate['B01001044'] + estimate['B01001045'],
								total: estimate['B01001018'] + estimate['B01001019'] + estimate['B01001020'] + estimate['B01001021'] + estimate['B01001042'] + estimate['B01001043'] + estimate['B01001044'] + estimate['B01001045']
							},
							{
								name: '70-79',
								male: estimate['B01001022'] + estimate['B01001023'],
								female: estimate['B01001046'] + estimate['B01001047'],
								total: estimate['B01001022'] + estimate['B01001023'] + estimate['B01001046'] + estimate['B01001047']
							},
							{
								name: '80+',
								male: estimate['B01001024'] + estimate['B01001025'],
								female: estimate['B01001048'] + estimate['B01001049'],
								total: estimate['B01001024'] + estimate['B01001025'] + estimate['B01001048'] + estimate['B01001049']
							}
						];
					}
				};
			});
