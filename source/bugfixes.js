'use strict';

define(function () {
  for (var i in gefs.fx.litRunways) {
    gefs.fx.litRunways[i].destroy();
    delete gefs.fx.litRunways[i];
  }

  // Make the angles used for PAPI more strict.  Assumes a 3 degree glideslope.
  function setPapi() {
    var collResult = gefs.getGroundAltitude(this.papiLocation[0], this.papiLocation[1]);
    this.papiLocation[2] = collResult.location[2];
    var relativeAicraftLla =
      [ gefs.aircraft.llaLocation[0]
      , gefs.aircraft.llaLocation[1]
      , this.papiLocation[2]
      ];

    var distance = V3.length(
      lla2xyz(
        V3.sub(relativeAicraftLla, this.papiLocation),
        this.papiLocation
      )
    );
    
    var height = gefs.aircraft.llaLocation[2] - this.papiLocation[2];
    var path = Math.atan2(height, distance) * radToDegrees;

    var papi = this.papi;
    [3.5, 19 / 6, 17 / 6, 2.5].forEach(function (slope, i) {
      var belowAngle = path < slope;
      papi[i].red.placemark.setVisibility(belowAngle);
      papi[i].white.placemark.setVisibility(!belowAngle);
    });
  }

  gefs.fx.RunwayLights.prototype.refreshPapi = function () {
    var that = this;
    this.papiInterval = setInterval(function () {
      setPapi.call(that);
    }, 1000);
  };

  gefs.fx.runway.refresh();
});
