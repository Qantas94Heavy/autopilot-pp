'use strict';

define([ 'knockout', 'util' ], function (ko, util) {
  var lat = ko.observable();
  var lon = ko.observable();

  var atan2 = Math.atan2;
  var sin = Math.sin;
  var cos = Math.cos;

  function getHeading() {
    var coords = geofs.aircraft.instance.llaLocation;
    var lat1 = util.deg2rad(coords[0]);
    var lon1 = util.deg2rad(coords[1]);
    var lat2 = util.deg2rad(lat());
    var lon2 = util.deg2rad(lon());

    if (!isFinite(lat2) || !isFinite(lon2)) return;

    var heading = util.rad2deg(
      atan2(
        sin(lon2 - lon1) * cos(lat2),
        cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lon2 - lon1)
      )
    );

    return util.fixAngle360(heading);
  }

  var gc =
    { latitude: lat
    , longitude: lon
    , getHeading: getHeading
    };

  return gc;
});
