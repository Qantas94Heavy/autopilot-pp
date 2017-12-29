'use strict';

define([ 'util' ], function (util) {
  function papiBugfix() {
    // Make the angles used for PAPI more strict.  Assumes a 3 degree glideslope.
    var papiValues = [ 3.5, 19 / 6, 17 / 6, 2.5 ];

    function setPapi() {
      var collResult = geofs.getGroundAltitude(this.runway.location[0], this.runway.location[1]);
      this.runway.location[2] = collResult.location[2];
      var relativeAicraftLla =
        [ geofs.aircraft.instance.llaLocation[0]
        , geofs.aircraft.instance.llaLocation[1]
        , this.runway.location[2]
        ];

      var distance = geofs.utils.llaDistanceInMeters(
        relativeAicraftLla, this.papiLocation, this.papiLocation
      );

      var height = geofs.aircraft.instance.llaLocation[2] - this.runway.location[2];
      var path = util.rad2deg(Math.atan2(height, distance));

      for (var j = 0; j < this.papis.length; j++) {
        var papi = this.papis[j].lights;
        papiValues.forEach(function (slope, i) {
          var belowAngle = path < slope;
          papi[i].red.setVisibility(belowAngle);
          papi[i].white.setVisibility(!belowAngle);
        });
      }
    }

    geofs.runwaysLights.prototype.refreshPapi = function () {
      var that = this;
      this.papiInterval = setInterval(function () {
        setPapi.call(that);
      }, 1000);
    };

    // Remove old PAPI and replace with the new one.
    Object.keys(geofs.fx.litRunways).forEach(function (id) {
      var runway = geofs.fx.litRunways[id];

      // Stop old PAPI update function.
      clearInterval(runway.papiInterval);

      // Remove old PAPI lights.
      for (var j = 0; j < runway.papis.length; j++) {
        for (var i = 0; i < runway.papis[j].lights.length; ++i) {
          runway.papis[j].lights[i].red.destroy();
          runway.papis[j].lights[i].white.destroy();
        }
      }

      // Create new PAPI lights.
      var frame = M33.rotationZ(M33.identity(), util.deg2rad(runway.runway.heading));
      var papiStep = xy2ll(V2.scale(frame[0], 9), runway.runway.location); // 9 meters
      runway.addPapi(runway.runway.location, papiStep);
    });
  }

  return papiBugfix;
});
