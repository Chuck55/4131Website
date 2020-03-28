		var x = 0;
		var service, map, infoWindow, currentpos, directionsRenderer, directionsService;
		var numberOfMarkers =0;
		var markers = [];
		function changeFish(){
			document.getElementById("fish").style.display= "block";
		}
		function changeMom(){
			document.getElementById("mom").style.display= "block";
		}
		function changeDad(){
			document.getElementById("dad").style.display= "block";
		}
		
		function changeFish2(){
			document.getElementById("fish").style.display= "none";
		}
		function changeMom2(){
			document.getElementById("mom").style.display= "none";
		}
		function changeDad2(){
			document.getElementById("dad").style.display= "none";
		}
		var $ = function (id){
			return(document.getElementById(id));
		}
		function slideshow() {
			var pics = ["mom.jpg", "dad.jpg", "fish.jpg"];
			$("placement").src = pics[x%3];
			x++;
		}
      function initMap() {
		directionsService = new google.maps.DirectionsService;
		directionsRenderer = new google.maps.DirectionsRenderer;

        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 44.9727, lng: -93.23540000000003},
          zoom: 16
        });
        directionsRenderer.setMap(map);
        infoWindow = new google.maps.InfoWindow;
       if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				title: 'You are here',
				icon: 'pokeball.jpg'
			});
            map.setCenter(pos);
            currentpos = pos;
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
     		  getLocations(map);
	}
	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
	function getLocations(map) {
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
		var geocoder = new google.maps.Geocoder();
		var table = document.getElementById("table");
		for (var x = 1; x <= 3; x++) {
			address = table.rows[x].cells[3].innerHTML;
			geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var myLatLng = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
				var marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					title: address,
					icon: 'pokeball.jpg'
				});

				markers.push(marker);
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
			});
		}
	}
 
	function reveal(index) {
		if (index.localeCompare("other") == 0) {
			document.getElementById("hidden").style.display= "block";
		} else {
			document.getElementById("hidden").style.display= "none";
		}		
	}
	function findNearby(facility, Searchradius, other) {
		var request;
		var search_location = new google.maps.LatLng(currentpos.lat, currentpos.lng);
		if (facility.localeCompare("other") == 0) {
		console.log (facility);
		console.log (other);
			request = {
				location: search_location,
				radius: Searchradius,
				type: [other]
			};
		} else {
			request = {
				location: search_location,
				radius: Searchradius,
				type: [facility]
			};
		}
		service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, callback);
	}
	function callback(results, status) {
          clearMarkers();
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
		  console.log(results.length);
		for (var i = 0; i < results.length; i++) {
		  var place = results[i];
		  createMarker(results[i]);
		}
	  }
	}
     	function createMarker(place) {
			console.log(place);
        	var marker = new google.maps.Marker({
        		map: map,
        		position: place.geometry.location,
        		title:place.name
        	});
		markers.push(marker);
        	google.maps.event.addListener(marker, 'click', function() {
        		infowindow.setContent(place.name);
        		infowindow.open(map, this);
        	});
	}
	function clearMarkers() {
		for (var i = 0; i < markers.length; i++) {
            		markers[i].setMap(null);
        }
		markers = [];
	}

	function findDirections (Mode, Destination){
		var search_location = new google.maps.LatLng(currentpos.lat, currentpos.lng);
		directionsService.route({
		  origin: search_location,
		  destination: Destination,
		  provideRouteAlternatives: false,
		  travelMode: Mode
		}, function(response, status) {
		if (status === 'OK') {
			directionsRenderer.setPanel(document.getElementById("directions"));
		document.getElementById("directions").style.display= "block";
			directionsRenderer.setDirections(response);
			console.log(response.routes);
		} else {
		  window.alert('Directions request failed due to ' + status);
		}
	  });
	}
