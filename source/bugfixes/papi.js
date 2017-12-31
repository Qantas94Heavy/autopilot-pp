'use strict';

define([ 'util' ], function (util) {
  function papiBugfix() {
    // Make the angles used for PAPI more strict.  Assumes a 3 degree glideslope.
    var papiValues = [ 3.5, 19 / 6, 17 / 6, 2.5 ];
    var aircraft = geofs.aircraft.instance;

    function setPapi() {
      var collResult = geofs.getGroundAltitude(this.location[0], this.location[1]);
      this.location[2] = collResult.location[2];
      var relativeAicraftLla =
        [ aircraft.llaLocation[0]
        , aircraft.llaLocation[1]
        , this.location[2]
        ];

      var distance = geofs.utils.llaDistanceInMeters(
        relativeAicraftLla, this.location, this.location
      );

      var height = aircraft.llaLocation[2] - this.location[2];
      var path = util.rad2deg(Math.atan2(height, distance));

      var lights = this.lights;
      papiValues.forEach(function (slope, i) {
        var belowAngle = path < slope;
        lights[i].red.setVisibility(belowAngle);
        lights[i].white.setVisibility(!belowAngle);
      });
    }

    geofs.fx.papi.prototype.refresh = function () {
      var that = this;
      this.papiInterval = setInterval(function () {
        setPapi.call(that);
      }, 1000);
    };

    // Make sure PAPI refresh function is updated if already loaded.
    Object.keys(geofs.fx.litRunways).forEach(function (id) {
      var runway = geofs.fx.litRunways[id];

      runway.papis.forEach(function (papi) {
        // Stop old PAPI update function.
        clearInterval(papi.papiInterval);

        // Start new PAPI refresh function.
        papi.refresh();
      });
    });
  }

  return papiBugfix;
});
