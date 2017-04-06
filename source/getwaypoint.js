'use strict';

define([ 'json!data/icaoairports.json', 'json!data/waypoints.json', 'util' ],
       function (icaos, waypoints, util) {
  function getClosestPoint(list) {
    // Duplicate waypoints, calculate closest waypoint to aircraft using the "Spherical Earth
    // projected to a plane" methdo described here:
    // https://en.wikipedia.org/wiki/Geographical_distance#Spherical_Earth_projected_to_a_plane
    var closestDistance = Infinity;

    // If the list only contains one element, it will be returned without calling the callback.
    return list.reduce(function (closestPoint, point) {
      // Current location of the aircraft.
      var acLat = geofs.aircraft.instance.llaLocation[0];
      var acLon = geofs.aircraft.instance.llaLocation[1];

      var deltaLat = util.deg2rad(acLat - point[0]);
      var deltaLon = util.deg2rad(acLon - point[1]);
      var meanLat = 0.5 * util.deg2rad(acLat + point[0]);

      // We don't need to square root the result or multiply the radius as we are just comparing
      // values to one another.
      var x = deltaLat;
      var y = deltaLon * Math.cos(meanLat);
      var relativeDistance = x * x + y * y;

      // Check if this point is closer or further away than the previous one.
      if (relativeDistance < closestDistance) {
        closestDistance = relativeDistance;
        return point;
      }

      // The current point is further away than the closest point so far.
      return closestPoint;
    });
  }

  function getWaypoint(code) {
    var coord = icaos[code];
    if (coord) return coord;

    coord = waypoints[code];
    if (coord) return getClosestPoint(coord);

    return null;
  }

  return getWaypoint;
});
