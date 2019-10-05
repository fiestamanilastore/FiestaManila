var geocoder;
var map;
var address = "1616 SE 10th Ave, Ft Lauderdale, FL 33316";
function initMap() {
var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 17,
  center: {lat: -34.397, lng: 150.644},
  gestureHandling: 'none',
  zoomControl: false
});
geocoder = new google.maps.Geocoder();
codeAddress(geocoder, map);
}

function codeAddress(geocoder, map) {
geocoder.geocode({'address': address}, function(results, status) {
  if (status === 'OK') {
    map.setCenter(results[0].geometry.location);
    var marker = new google.maps.Marker({
      map: map,
      position: results[0].geometry.location
    });
  } else {
    alert('Geocode was not successful for the following reason: ' + status);
  }
});
}
