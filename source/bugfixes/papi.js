'use strict';

define([ 'util' ], function (util) {
  function papiBugfix() {
    // Make the angles used for PAPI more strict.  Assumes a 3 degree glideslope.
    var papiValues = [ 3.5, 19 / 6, 17 / 6, 2.5 ];

    function setPapi() {
      var collResult = gefs.getGroundAltitude(this.papiLocation[0], this.papiLocation[1]);
      this.papiLocation[2] = collResult.location[2];
      var relativeAicraftLla =
        [ gefs.aircraft.llaLocation[0]
        , gefs.aircraft.llaLocation[1]
        , this.papiLocation[2]
        ];

      var distance = llaDistance(relativeAicraftLla, this.papiLocation, this.papiLocation);

      var height = gefs.aircraft.llaLocation[2] - this.papiLocation[2];
      var path = util.rad2deg(Math.atan2(height, distance));

      var papi = this.papi;
      papiValues.forEach(function (slope, i) {
        var belowAngle = path < slope;
        papi[i].red.setVisibility(belowAngle);
        papi[i].white.setVisibility(!belowAngle);
      });
    }

    gefs.fx.RunwayLights.prototype.refreshPapi = function () {
      var that = this;
      this.papiInterval = setInterval(function () {
        setPapi.call(that);
      }, 1000);
    };

    // Remove old PAPI and replace with the new one.
    Object.keys(gefs.fx.litRunways).forEach(function (id) {
      var runway = gefs.fx.litRunways[id];

      // Stop old PAPI update function.
      clearInterval(runway.papiInterval);

      // Remove old PAPI lights.
      for (var i = 0; i < 4; ++i) {
        runway.papi[i].red.destroy();
        runway.papi[i].white.destroy();
      }

      // Create new PAPI lights.
      var frame = M33.rotationZ(M33.identity(), util.deg2rad(runway.heading));
      var papiStep = xy2ll(V2.scale(frame[0], 9), runway.location); // 9 meters
      runway.addPapi(runway.papiLocation, papiStep);
    });
  }

  return papiBugfix;
});
