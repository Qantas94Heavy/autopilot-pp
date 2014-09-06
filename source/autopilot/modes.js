'use strict';

define(['autopilot/pidcontrols', 'speedconversions'], function (pidControls, speedConversions) {
  var modes = 
    { heading:
      { isEnabled: false
      , enable: function () {
          pidControls.roll.reset();
          this.isEnabled = true;
        }
      , diable: function () {
          this.isEnabled = false;
        }
      , value: 0
      , set: function (heading) {
          if (isFinite(heading)) this.value = fixAngle360(heading);
        }
      }
    , altitude:
      { isEnabled: false
      , enable: function () {
          pidControls.climb.reset();
          pidControls.pitch.reset();
          this.isEnabled = true;
        }
      , disable: function () {
          this.isEnabled = false;
        }
      , value: 0
      , set: function (altitude) {
          if (isFinite(altitude)) this.value = altitude;
        }
      }
    , speed:
      { isEnabled: false
      , enable: function () {
          pidControls.throttle.reset();
          this.isEnabled = true;
        }
      , disable: function () {
          this.isEnabled = false;
        }
      , isMach: false
      , toMach: function () {
          this.value = speedConversions.casToMach(this.value);
        }
      , toKias: function () {
          this.value = speedConversions.machToCas(this.value);
        }
      , set: function (speed) {
          if (isFinite(speed)) this.value = speed;
        }
      , value: 0
      }
    , vs:
      { isEnabled: false
      , enable: function () {
          this.isEnabled = true;
        }
      , disable: function () {
          this.isEnabled = false;
        }
      , set: function (vs) {
          if (isFinite(vs)) this.value = vs;
        }
      , value: 0
      }
    };
  
  return modes;
});
