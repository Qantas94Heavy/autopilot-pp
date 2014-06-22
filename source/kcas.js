'use strict';

define(['speedconversions'], function (speedConversions) {
  // convert KTAS to KCAS
  var timer = setInterval(function () {
    if (window.instruments && instruments.definitions) {
      ['airspeed', 'airspeedJet', 'airspeedSupersonic'].forEach(function (prop) {
        instruments.definitions[prop].overlay.overlays[0].animations[0].value = 'kcas';
      });
      clearInterval(timer);
    }
  }, 16);
  
  // ensure KCAS property is set
  google.earth.addEventListener(ge, 'frameend', function () {
    if (window.ges && ges.aircraft && ges.aircraft.animationValue) {
      var animationValue = ges.aircraft.animationValue;
      animationValue.kcas = speedConversions.tasToCas(animationValue.ktas, animationValue.altitude * 0.3048);
    }
  });
});