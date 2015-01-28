'use strict';

define(['autopilot/pidcontrols', 'speedconversions'], function (pidControls, speedConversions) {
  var modes = 
    { heading:
      { isEnabled: false
      , enable: function () {
          pidControls.roll.reset();
          this.isEnabled = true;
        }
      , disable: function () {
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
          controls.elevatorTrim = controls.rawPitch;
          controls.rawPitch = 0;
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
          // round to nearest 0.01
          var altitude = ges.aircraft.animationValue.altitude * 0.3048;
          this.value = Math.round(100 * speedConversions.casToMach(this.value, altitude)) / 100;
        }
      , toKias: function () {
          var altitude = ges.aircraft.animationValue.altitude * 0.3048;
          this.value = Math.round(speedConversions.machToCas(this.value, altitude));
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
          $(window).trigger('autopilotvsenabled');
        }
      , disable: function () {
          this.isEnabled = false;
          $(window).trigger('autopilotvsdisabled');
        }
      , set: function (vs) {
          if (isFinite(vs)) this.value = vs;
        }
      , value: 0
      }
    };
  
  return modes;
});
