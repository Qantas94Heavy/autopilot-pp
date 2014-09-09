'use strict';

// TODO: would like to remove dependency on autopilot at some point
define(['autopilot/modes'], function (apModes) {
  var timer, lat, lon;
  var aircraft = ges.aircraft;
  var apHeading = apModes.heading;
  
  var atan2 = Math.atan2;
  var sin = Math.sin;
  var cos = Math.cos;
  var round = Math.round;
  var twoPi = Math.PI * 2;
  
  var decimalsOnly = /^[+-]?\d+\.?\d*$/;
  
  function getHeading() {
    var coords = aircraft.getCurrentCoordinates();
    var lat1 = coords[0] * degreesToRad;
    var lon1 = coords[1] * degreesToRad;
    var lat2 = lat * degreesToRad;
    var lon2 = lon * degreesToRad;
    return fixAngle360(
      atan2(
        sin(lon2 - lon1) * cos(lat2),
        cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lon2 - lon1)
      ) % twoPi * radToDegrees
    );
  }
  
  // TODO: separate logic from view
  function setHeading() {
    if (typeof lat === 'number' && typeof lon === 'number') {
      apHeading.set(round(getHeading(lat, lon)));
      $('#Qantas94Heavy-ap-hdg').val(apHeading.value);
    }
  }
  
  var gc =
    { isEnabled: false
    , enable: function () {
        clearInterval(timer);
        timer = setInterval(setHeading, 1000);
        this.isEnabled = true;
      }
    , disable: function () {
        clearInterval(timer);
        timer = null;
        this.isEnabled = false;
      }
    , getLatitude: function () {
        return +lat;
      }
    , getLongitude: function () {
        return +lon;
      }
    , getHeading: getHeading
    , setLatitude: function (newLat) {
        if (decimalsOnly.test(newLat)) lat = clamp(parseFloat(newLat), -90, 90);
      }
    , setLongitude: function (newLon) {
        if (decimalsOnly.test(newLon)) lon = clamp(parseFloat(newLon), -180, 180);
      }
    };
  
  return gc;
});
