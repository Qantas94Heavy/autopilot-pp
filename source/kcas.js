'use strict';

define(['speedconversions'], function (speedConversions) {
  // convert KTAS to KCAS
  ['airspeed', 'airspeedJet', 'airspeedSupersonic'].forEach(function (prop) {
    instruments.definitions[prop].overlay.overlays[0].animations[0].value = 'kcas';
  });
  instruments.init(instruments.list);

  // ensure KCAS property is set
  // FIXME: CESIUM
  setInterval(function () {
    if (window.gefs && gefs.aircraft && gefs.aircraft.animationValue) {
      var animationValue = gefs.aircraft.animationValue;
      animationValue.kcas = speedConversions.tasToCas(animationValue.ktas, animationValue.altitude * 0.3048);
    }
  });
});
