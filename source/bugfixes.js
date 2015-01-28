'use strict';

define(function () {
  // bug fix for camera freeze issue when passing +/-180 degrees longitude
  rigidBody.prototype.integrateTransform = function (s_step) {
    var aircraft = ges.aircraft;
    var llaTranslation = xyz2lla(V3.scale(this.v_linearVelocity, s_step), aircraft.llaLocation);
    aircraft.llaLocation = V3.add(aircraft.llaLocation, llaTranslation);
    aircraft.llaLocation[0] = fixAngle(aircraft.llaLocation[0], -90, 90);
    aircraft.llaLocation[1] = fixAngle(aircraft.llaLocation[1], -180, 180);
    var rot = M33.transformByTranspose(aircraft.object3d._rotation, V3.scale(this.v_angularVelocity, s_step));
    aircraft.object3d.rotate(rot);
    this.v_resultForce = V3.sub(this.v_linearVelocity, this.v_prevLinearVelocity);
    this.v_resultTorque = V3.sub(this.v_angularVelocity, this.v_prevTotalTorque);
    this.v_prevLinearVelocity = V3.dup(this.v_linearVelocity);
    this.v_prevTotalTorque = V3.dup(this.v_angularVelocity);
    this.clearForces();
  };
  
  // GEFS PAPI is not correctly calibrated
  for (var i in ges.fx.litRunways) {
    ges.fx.litRunways[i].destroy();
    delete ges.fx.litRunways[i];
  }
    
  ges.fx.RunwayLights.prototype.refreshPapi = function () {
    this.papiInterval = setInterval(function () {
      var collResult = ges.getGroundAltitude(this.papiLocation[0], this.papiLocation[1]);
      this.papiLocation[2] = collResult.location[2];
      var relativeAicraftLla = [ges.aircraft.llaLocation[0], ges.aircraft.llaLocation[1], this.papiLocation[2]];
      var distance = V3.length(lla2xyz(V3.sub(relativeAicraftLla, this.papiLocation), this.papiLocation));
      var height = ges.aircraft.llaLocation[2] - this.papiLocation[2];
      var path = Math.atan2(height, distance) * radToDegrees;
      
      // assuming a 3 degree glideslope
      // this.papy is deliberate (it's spelt incorrectly in the original GEFS script)
      var papi = this.papy;
      [3.5, 19 / 6, 17 / 6, 2.5].forEach(function (slope, i) {
        var belowAngle = path < slope;
        papi[i].red.placemark.setVisibility(belowAngle);
        papi[i].white.placemark.setVisibility(!belowAngle);
      });
    }.bind(this), 1000);
  };
  
  ges.fx.runway.refresh();
});
