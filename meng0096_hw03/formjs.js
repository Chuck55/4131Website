		function testInput(NameId, EmailId, AddressId, FavId, URLId) {
		testNameAndPlace(NameId);
		testNameAndPlace(FavId);
		return true;
	}
	function testNameAndPlace(NameId) {
		console.log("hello");
		var input = document.getElementById(NameId);
		var validityState_object = input.validity;
		if(validityState_object.valueMissing) {
			input.setCustomValidity('Please Fill This in');
		} else if (!hasNonLetter(input.value)) {
			input.setCustomValidity('Only Letters Please');
		} else {
			input.setCustomValidity('');
		}
	}
	function hasNonLetter(myString) {
		return /^[0-9 a-z A-Z]+$/.test(myString);
}
     function initMap() {
		directionsService = new google.maps.DirectionsService;
		directionsRenderer = new google.maps.DirectionsRenderer;

        map = new google.maps.Map(document.getElementById('map2'), {
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
		var input = document.getElementById("address");
		var autocomplete = new google.maps.places.Autocomplete(input);	
	}
	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
	window.onload = function (){
		google.maps.event.addListener(map, "click", function (event) {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'latLng': event.latLng }, function (results, status) {
			if (status !== google.maps.GeocoderStatus.OK) {
				alert(status);
			}
			// This is checking to see if the Geoeode Status is OK before proceeding
			if (status == google.maps.GeocoderStatus.OK) {
				console.log(results);
				var address = (results[0].formatted_address);
				document.getElementById('address').value = address;
			}
		});
	})}
