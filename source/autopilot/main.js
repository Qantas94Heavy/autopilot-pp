'use strict';

define(['pid', 'autopilot/pidcontrols', 'autopilot/modes', 'speedconversions'], function (PID, pidControls, apModes, speedConversions) {
  function turnOn(altitude, heading, speed) {
    if (!ges.aircraft.setup.autopilot) return;
    
    Object.keys(pidControls).forEach(function (prop) {
      pidControls[prop].reset();
    });
      
    apModes.altitude.set(altitude);
    apModes.heading.set(heading);
    apModes.speed.set(speed);
    
    autopilot.on = true;
    ui.hud.autopilotIndicator(true);
    
    $(window).trigger('autopilotengaged');
  }

  function turnOff() {
    Object.keys(apModes).forEach(function (prop) {
      apModes[prop].enabled = false;
    });
  
    autopilot.on = false;
    ui.hud.autopilotIndicator(false);
    
    $(window).trigger('autopilotdisengaged');
  }
  
  var update = (function () {
    var abs = Math.abs;
    var max = Math.max;
    var min = Math.min;
    var arctan = Math.atan;
    var lastAileronPosition, lastElevatorPosition;
    
    return function (dt) {
      var values = ges.aircraft.animationValue;
      
      // calculate relative speed of aircraft as correction factor
      // is value arbitrary? Maybe use power of two instead
      // why aren't we using KCAS instead? Need to investigate
      var speedRatio = clamp(values.kias / 100, 1, 5);
      
      // ensure autopilot not used below 500ft AGL and check for abnormal flight conditions
      if (!DEBUG && (values.altitude - max(ges.groundElevation * metersToFeet, -1000) < 500 ||
                     ui.hud.stallAlarmOn || abs(values.aroll) > 45 || values.atilt > 20 ||
                     values.atilt < -35)) return void autopilot.turnOff();

      // elevator setting, altitude/vertical speed mode
      function updateAltitude() {
        var deltaAltitude = apModes.altitude.value - values.altitude;
        var maxClimbRate = clamp(speedRatio * autopilot.commonClimbRate, 0, autopilot.maxClimbRate);
        var maxDescentRate = clamp(speedRatio * autopilot.commonDescentRate, autopilot.maxDescentRate, 0);
        var vsInput = $('#Qantas94Heavy-ap-vs');
        var vsValue = apModes.vs.value;
        var targetClimbRate;
        
        // check if vertical speed manually set or not
        if (apModes.vs.enabled) {
          // check that vertical speed is in right direction to altitude
          if (vsValue === 0 || vsValue < 0 ? deltaAltitude < -200 : deltaAltitude > 200) targetClimbRate = vsValue;
          else {
            // TODO: refactor to remove repetition of code below
            apModes.vs.enabled = false;
            targetClimbRate = clamp(deltaAltitude * 2.5, maxDescentRate, maxClimbRate);
            if (vsInput.val()) vsInput.val('');
          }
        } else {
          // automatically calculate vertical speed
          targetClimbRate = clamp(deltaAltitude * 2.5, maxDescentRate, maxClimbRate);
          if (vsInput.val()) vsInput.val('');
        }
        
        var aTargetTilt = pidControls.climb.compute(values.climbrate, dt, targetClimbRate);
        aTargetTilt = clamp(aTargetTilt, autopilot.minPitchAngle, autopilot.maxPitchAngle);

        var result = pidControls.pitch.compute(-values.atilt, dt, aTargetTilt);
        controls.rawPitch = exponentialSmoothing('apPitch', result / speedRatio, 0.9);
        // add an elevator deflection rate limiter

        ges.debug.watch('targetClimbrate', targetClimbRate);
        ges.debug.watch('aTargetTilt', aTargetTilt);
      }
      
      // set aileron/rudder, heading mode
      function updateHeading() {
        // difference in target/current headings, bound to range -180 to 180 degrees
        var deltaHeading = fixAngle(values.heading - apModes.heading.value);
        // double standard rate turn or max bank angle, whichever is less
        var maxBankAngle = min(arctan(0.0027467328927254283 * values.ktas) * radToDegrees, autopilot.maxBankAngle);
        // bank angle equal to difference in headings, up to limit (10° heading = 10° bank)
        var targetBankAngle = clamp(deltaHeading, -maxBankAngle, maxBankAngle);
        
        // rudder equal to half the aileron deflection
        controls.yaw = exponentialSmoothing('apYaw', values.roll / 2, 0.1);
        
        var result = -pidControls.roll.compute(values.aroll, dt, targetBankAngle);
        controls.roll = exponentialSmoothing('apRoll', result / speedRatio, 0.9);
        // 100% hack, A380 ailerons suck
        if (ges.aircraft.name === 'a380') controls.roll *= 3.5;
        
        // add an aileron deflection rate limiter
      }

      function updateThrottle() {
        var conditions = speedConversions.standardConditions(values.altitude);
        var speed = apModes.speed.isMach ? speedConversions.machToCas() : apModes.speed.value;
        
        var result = pidControls.throttle.compute(values.kcas, dt, speed);
        controls.throttle = clamp(exponentialSmoothing('apThrottle', result, 0.9), 0, 1);
        ges.debug.watch('throttle', controls.throttle);
      }
      
     if (apModes.altitude.enabled) updateAltitude();
      if (apModes.heading.enabled) updateHeading();
      if (apModes.speed.enabled) updateThrottle();
    };
  })();

  var autopilot =
    { modes: apModes
    , update: update
    , turnOn: turnOn
    , turnOff: turnOff
    , on: false
    , maxBankAngle: 25
    , minPitchAngle: -10
    , maxPitchAngle: 10
    , commonClimbRate: 500
    , commonDescentRate: -750
    , maxClimbRate: 3000
    , maxDescentRate: -4000
    , pid: pidControls
    };
  
  // needed for compatibility reasons at the moment (mainly autopilot.update)
  controls.autopilot = autopilot;
  return autopilot;
});
