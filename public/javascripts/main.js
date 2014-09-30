$(function () {
	app = angular.module('B', []);
	app.controller('rangeAgeController', function($scope) {
		this.range = {
			min: 18,
			max: 60
		};
	});
	app.controller('dndController', function($scope) {
		$scope.list1 = {title: 'foo'};
		$scope.list2 = {};
	});
	app.controller('appCtrl', function($scope) {
	});

	console.log('hello');
	console.log('hi again');
	var mapQuest = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
		attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		subdomains: '1234'
			// }).addTo(map);
	});
	var map;
	$.getJSON('geodata/tracts2010.json', function (data) {
		var onEachFeature = function (feature, layer) {
			var defaultStyle = {
				color: "#2262CC",
				weight: 1,
				opacity: 0.6,
				fillOpacity: 0.1,
				fillColor: "#2262CC"
			};
			var highlightStyle = {
				color: '#2262CC',
				weight: 1,
				opacity: 0.6,
				fillOpacity: 0.65,
				fillColor: '#2262CC'
			};
			// console.log('onEachFeature');
			(function (layer, properties) {
				// console.log('properties', properties);
				// Create a mouseover event
				layer.on("mouseover", function (e) {
					// debugger;
					var tract_id = e.target.feature.id;
					// Change the style to the highlighted version
					layer.setStyle(highlightStyle);
					// Create a popup with a unique ID linked to this record
					var popup = $("<div></div>", {
						id: "popup-" + tract_id,
						css: {
							position: "absolute",
							bottom: "85px",
							left: "50px",
							zIndex: 1002,
							backgroundColor: "white",
							padding: "8px",
							border: "1px solid #ccc"
						}
					});
					// Insert a headline into that popup
					var hed = $("<div></div>", {
						text: "Tract ID: " + tract_id + ' ' + $("#filters option:selected").text() + ' ' + census_data[tract_id],
						css: {
							fontSize: "16px",
							marginBottom: "3px"
						}
					}).appendTo(popup);
					// Add the popup to the map
					popup.appendTo("#map");
				});
				// Create a mouseout event that undoes the mouseover changes
				layer.on("mouseout", function (e) {
					var tract_id = e.target.feature.id;
					// Start by reverting the style back
					layer.setStyle(defaultStyle);
					// And then destroying the popup
					$("#popup-" + tract_id).remove();
				});
				// Close the "anonymous" wrapper function, and call it while passing
				// in the variables necessary to make the events work the way we want.
			})(layer, feature.properties);
		};
		var tracts2010 = L.geoJson(topojson.feature(data, data.objects.tracts2010), {
			onEachFeature: onEachFeature
		});
		// L.control.layers(data).addTo(map);
		map = new L.Map('map', {
			center: [42.3557, -71.0650],
			zoom: 13,
			layers: [mapQuest, tracts2010]
		});
		L.control.scale().addTo(map);
		console.log(map, '-----------');
		map.on('moveend load', function () {
			function constructYelpURL(category_filter) {
				var URL = "http://api.yelp.com/" +
					"business_review_search?"+
					"callback=" + "handleResults" +
					"&term=" + document.getElementById("term").value + 
					"&num_biz_requested=10" +
					"&tl_lat=" + mapBounds.getSouthWest().lat() +
					"&tl_long=" + mapBounds.getSouthWest().lng() + 
					"&br_lat=" + mapBounds.getNorthEast().lat() + 
					"&br_long=" + mapBounds.getNorthEast().lng() +
					"&ywsid=" + YWSID;
			}
			console.log(arguments);
			var map_center = map.getCenter();
			var data_id = $('#business').val();
			var category_filter = $('#yelp-business').val();
			$.ajax({
				url: 'http://api.yelp.com/v2/search',
				data: {
					category_filter: category_filter
				},
				/*
				url: 'http://data.cityofboston.gov/resource/' + data_id + '.json',
				data: {
					'$where': 'within_circle(location,' + map_center.lat + ',' + map_center.lng + ',2000)'
				},
				*/
				dataType: 'json',
				success: function (data) {
					console.log(data);
					/*
					for (var i = 0; i < data.length; i++) {
						var location = [data[i].location.latitude, data[i].location.longitude];
						var popup = '';
						// debugger;
						for (var k in data[i]) {
							if (data[i].hasOwnProperty(k)) {
								popup += k + ': ' + data[i][k] + '<br/>';
							}
						}
						var marker = L.marker(location).addTo(map).bindPopup(popup);
					}
					*/
				}
			});
		});

		var baseLayers = {
			"Map Quest": mapQuest
		};

		var overlays = {
			"2010 Tracts": tracts2010
		};

		L.control.layers(baseLayers, overlays).addTo(map);
	});
	var census_data = {};
	$('#filters').on('change', function (e) {
		// debugger;
		var census_var = this.value;
		// console.log(this.value);
		$.ajax({
			url: 'http://api.census.gov/data/2012/acs5',
			data: {
				'for': 'tract:*',
				'in': 'state:25+county:*',
				'key': '2b4b319d9a6ffbcfa81e15e94da52aa46bd901ec',
				'get': this.value
			},
			dataType: 'json',
			success: function (data) {
				// debugger;
				// shift away the header
				data.shift();
				for (var i = 0; i < data.length; i++) {
					var tract_id = '' + data[i][1] + data[i][2] + data[i][3];
					// console.log('tract_id', tract_id);
					census_data[tract_id] = data[i][0];
				}
			}
		});
	});

	$('#yelp-business').on('change', function (e) {
		// debugger;
		var category_filter = this.value;
		$.ajax({
			url: 'http://api.yelp.com/v2/search?category_filter=' + category_filter
		})
	})

	$('#business').on('change', function (e) {
		// debugger;
		var data_var = this.value;
		$.ajax({
			url: 'http://data.cityofboston.gov/resource/'
		})
	});
	$("#location").autocomplete({
      source: function( request, response ) {
		  console.log(request, 'request');
		  console.log(response, 'response');
        $.ajax({
          url: "http://api.censusreporter.org/1.0/geo/search",
          dataType: "json",
          data: {
			q: request.term
          },
          success: function( data ) {
			response($.map(data.results, function (item, i) {
			console.log(i, 'i');
			console.log(item, 'item');
				return {
					'id': item.full_geoid,
					'label': item.full_name,
					'value': item.full_geoid
				};
			}));
            // response( data );
          }
        });
      },
      minLength: 3,
      select: function( event, ui ) {
		console.log( ui.item ?
		"Selected: " + ui.item.label + ' value: ' + ui.item.value :
		"Nothing selected, input was " + this.value);
		var geoId = ui.item.value;
        $.ajax({
          url: 'http://api.censusreporter.org/1.0/geo/tiger2012/' + geoId,
          dataType: 'json',
          data: {
			geom: true
          },
          success: function( data ) {
			console.log(data);
			var geoJson = {
				type: 'FeatureCollection',
				features: [
					data
				]
			};
			// L.geoJson(data, {
			// NOTE: Carrie please fix this part
			var fooLayer = L.geoJson().addTo(map);
			fooLayer.addData(geoJson);
			/*
			L.geoJson(geoJson, {
				style: function (feature) {
					return {color: feature.properties.color};
				},
				onEachFeature: function (feature, layer) {
					// layer.bindPopup(feature.properties.description);
				}
			}).addTo(map);
			*/

          }
        });
		var tableId = 'B01001';
		$.ajax({
			url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=' + tableId + '&geo_ids=' + geoId,
			dataType: 'json',
			success: function( data ) {
				var tableHtml = "<div id='chart'></div>";
				var cols = data.tables[tableId].columns;
				var total;
				var estimate = data.data[geoId][tableId].estimate;
				var aggregated = [
					{ 
						name: '0-9',
						male: estimate['B01001003'] +  estimate['B01001004'],
						female: estimate['B01001027'] + estimate['B01001028'],
						total: estimate['B01001003'] + estimate['B01001004'] +  estimate['B01001027'] +  estimate['B01001028']
					},
					{
						name: '10-19',
						male: estimate['B01001005'] +  estimate['B01001006'] +  estimate['B01001007'],
						female: estimate['B01001029'] +  estimate['B01001030'] +  estimate['B01001031'],
						total: estimate['B01001005'] +  estimate['B01001006'] +  estimate['B01001007'] +  estimate['B01001029'] +  estimate['B01001030'] +  estimate['B01001031']
					},
					{
						name: '20-29',
						male: estimate['B01001008'] +  estimate['B01001009'] +  estimate['B01001010'] +  estimate['B01001011'],
						female: estimate['B01001032'] +  estimate['B01001033'] +  estimate['B01001034'] +  estimate['B01001035'],
						total: estimate['B01001008'] +  estimate['B01001009'] +  estimate['B01001010'] +  estimate['B01001011'] +  estimate['B01001032'] +  estimate['B01001033'] +  estimate['B01001034'] +  estimate['B01001035']
					},
					{
						name: '30-39',
						male: estimate['B01001012'] +  estimate['B01001013'],
						female: estimate['B01001036'] +  estimate['B01001037'],
						total: estimate['B01001012'] +  estimate['B01001013'] +  estimate['B01001036'] +  estimate['B01001037']
					},
					{
						name: '40-49',
						male: estimate['B01001014'] +  estimate['B01001015'],
						female: estimate['B01001038'] +  estimate['B01001039'],
						total: estimate['B01001014'] +  estimate['B01001015'] +  estimate['B01001038'] +  estimate['B01001039']
					},
					{
						name: '50-59',
						male: estimate['B01001016'] +  estimate['B01001017'],
						female: estimate['B01001040'] +  estimate['B01001041'],
						total: estimate['B01001016'] +  estimate['B01001017'] +  estimate['B01001040'] +  estimate['B01001041']
					},
					{
						name: '60-69',
						male: estimate['B01001018'] +  estimate['B01001019'] +  estimate['B01001020'] +  estimate['B01001021'],
						female: estimate['B01001042'] +  estimate['B01001043'] +  estimate['B01001044'] +  estimate['B01001045'],
						total: estimate['B01001018'] +  estimate['B01001019'] +  estimate['B01001020'] +  estimate['B01001021'] +  estimate['B01001042'] +  estimate['B01001043'] +  estimate['B01001044'] +  estimate['B01001045']
					},
					{
						name: '70-79',
						male: estimate['B01001022'] +  estimate['B01001023'],
						female: estimate['B01001046'] +  estimate['B01001047'],
						total: estimate['B01001022'] +  estimate['B01001023'] +  estimate['B01001046'] +  estimate['B01001047']
					},
					{
						name: '80+',
						male: estimate['B01001024'] +  estimate['B01001025'],
						female: estimate['B01001048'] +  estimate['B01001049'],
						total: estimate['B01001024'] +  estimate['B01001025'] +  estimate['B01001048'] +  estimate['B01001049']
					}
				];
				for ( column in cols ) {
					for ( var i = 0; i < cols[column].indent; i++ ) {
						tableHtml += "&nbsp;&nbsp;&nbsp;";
					}
					var name = cols[column].name;
					var count = data.data[geoId][tableId].estimate[column];
					if ( name.substr(0,5).toLowerCase() === 'total' ) {
						total = count;
					}
					tableHtml += name;
					tableHtml += ":&nbsp;";
					tableHtml += count;
					tableHtml += "<br />";
				}
				$("#rightsidebar").html( tableHtml );
				d3.select("#chart")
					.selectAll("div")
					.data(aggregated)
					.enter().append("div")
					.style("width", function(d) { 
						return 175 * d.total / total + "%"; 
					})
					.text(function(d) { 
						return d.name; 
					});
			}
		});
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    });
	/*
	$('#location').on('keyup', function (e) {
		if (e.which === 13) {
			$.ajax({
				url: 'http://www.mapquestapi.com/geocoding/v1/address',
				data: 'key=Fmjtd%7Cluur2g62nq%2C8x%3Do5-9a85q4&location=' + $('#location').val(),
				dataType: 'json',
				success: function (data) {
					// debugger;
					var location = data.results[0].locations[0].latLng;
					map.setView([location.lat, location.lng]);
					// shift away the header
				}
			});
		}
	});
	*/
});
