'use strict';

// Prevent aircraft from exceeding limits of altitude and speed.
define(function () {
  function restrictionsBugfix() {
    var speedTimer, partsTimer, deleteTimer, deleteTimeout, oldMaxRPM;
    var activated = false;

    function checkSpeedAndAltitude() {
      var values = gefs.aircraft.animationValue;
      if (values.mach < 1 && values.altitude < 44444) return;

      clearInterval(speedTimer);
      speedTimer = undefined;
      activated = true;

      // Hey, can't fly without wings, can you?!
      gefs.aircraft.airfoils.forEach(function (airfoil) {
        if (airfoil.area) airfoil.area /= 128;
        else if (airfoil.liftFactor) airfoil.liftFactor /= 128;
      });

      // Show some evil smoke!
      // ParticuleEmitter is spelt incorrectly in GEFS, as well as using "new" for a function with
      // side effects.
      new gefs.fx.ParticuleEmitter(
      { anchor: { worldPosition: [0, 0, 0] }
      , duration: 30000
      , rate: 0.05
      , life: 2000
      , startScale: 1
      , endScale: 50
      , startOpacity: 100
      , endOpacity: 1
      , texture: 'darkSmoke'
      });

      // Disable the thrust.
      gefs.aircraft.engines.forEach(function (engine) {
        engine.thrust /= 16384;
      });

      // Display thrust as zero.
      oldMaxRPM = gefs.aircraft.setup.maxRPM;
      gefs.aircraft.setup.maxRPM = gefs.aircraft.setup.minRPM + 1;

      // Let's have the parts a-flyin'!
      partsTimer = setInterval(function () {
        gefs.aircraft.object3d._children.forEach(function (object) {
          var position = object._localposition;
          for (var j = 0; j < 2; j++) position[j] *= 1.01;
        });
      }, 100);

      deleteTimeout = setTimeout(function () {
        clearInterval(partsTimer);
        var i = 0;

        // Bye bye parts!!!
        var parts = gefs.aircraft.object3d._children;
        deleteTimer = setInterval(function () {
          ++i;

          // Hide the part of aircraft.
          if (i === parts.length) {
            // Remove the body last.
            parts[0].visible = false;
            clearInterval(deleteTimer);
          }
          else parts[i].visible = false;
        }, 300);
      }, 12000);
    }

    var oldReset = Aircraft.prototype.reset;
    Aircraft.prototype.reset = function (bOnTheGround) {
      clearTimeout(deleteTimeout);
      clearInterval(deleteTimer);
      clearInterval(partsTimer);

      if (activated) {
        gefs.aircraft.airfoils.forEach(function (airfoil) {
          if (airfoil.area) airfoil.area *= 128;
          else if (airfoil.liftFactor) airfoil.liftFactor *= 128;
        });

        gefs.aircraft.engines.forEach(function (engine) {
          engine.thrust *= 16384;
        });

        gefs.aircraft.setup.maxRPM = oldMaxRPM;
        activated = false;
      }

      if (matchesName() && speedTimer === undefined) {
        speedTimer = setInterval(checkSpeedAndAltitude, 5000);
      }

      oldReset.call(this, bOnTheGround);
    };

    function matchesName() {
      return /^(?:md11|a380|\d+)$/.test(gefs.aircraft.name);
    }

    if (matchesName()) speedTimer = setInterval(checkSpeedAndAltitude, 5000);
  }

  return restrictionsBugfix;
});
