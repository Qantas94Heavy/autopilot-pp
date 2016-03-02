'use strict';

define(['speedconversions'], function (speedConversions) {
  // Convert KTAS to KCAS.
  // Ensure "kcas" property is set before changing it.
  var kcasSet = false;
  setInterval(function () {
    if (window.gefs && gefs.aircraft && gefs.aircraft.animationValue) {
      var animationValue = gefs.aircraft.animationValue;
      animationValue.kcas = speedConversions.tasToCas(
        animationValue.ktas, animationValue.altitude * 0.3048
      );

      if (!kcasSet) {
        ['airspeed', 'airspeedJet', 'airspeedSupersonic'].forEach(function (prop) {
          // Set it for any aircraft that load in the future.
          instruments.definitions[prop].overlay.overlays[0].animations[0].value = 'kcas';
          if (instruments.list && instruments.list[prop]) {
            // Set it for the currently loaded aircraft.
            instruments.list[prop].overlay.children[0].definition.animations[0].value = 'kcas';
          }
        });

        kcasSet = true;
      }
    }
  }, 16);
});
