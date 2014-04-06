// ==UserScript==
// @name Autopilot++ for GEFS-Online
// @description This extension (by Qantas 94 Heavy) takes the GEFS autopilot to the next level!
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.6.0
// @grant none
// ==/UserScript==

// NOTE: since we are only releasing this plugin for Chrome and Firefox, ES3 compatibility will be no longer be maintained.
'use strict';

// JSHint has a bug with indirect eval calls, so we're going to disable that warning
// jshint -W067

// quit whinging about Infinity as parameter and possible strict violation
// jshint -W040
(function main(window, DEBUG) {
  if (typeof controls !== 'object') return void setTimeout(main, 10);
  
  // make the PAPI angle correct (currently GEFS is too lenient)
  var t1 = setInterval(function () {
    if (window.ges && ges.fx && ges.fx.RunwayLights) {
      for (var i in ges.fx.litRunways) ges.fx.litRunways[i].destroy();
      
      ges.fx.RunwayLights.prototype.refreshPapi = function () {
        this.papiInterval = setInterval(function () {
          var collResult = ges.getGroundAltitude(this.papiLocation[0], this.papiLocation[1]);
          this.papiLocation[2] = collResult.location[2];
          var relativeAicraftLla = [ges.aircraft.llaLocation[0], ges.aircraft.llaLocation[1], this.papiLocation[2]];
          var distance = V3.length(lla2xyz(V3.sub(relativeAicraftLla, this.papiLocation), this.papiLocation));
          var height = ges.aircraft.llaLocation[2] - this.papiLocation[2];
          var path = Math.atan2(height, distance) * radToDegrees;
          
          // assuming a 3 degree glideslope
          var papi = this.papy;
          [3.5, 19/6, 17/6, 2.5].forEach(function (slope, i) {
            var belowGlideslope = path < slope;
            papi[i].red.placemark.setVisibility(belowGlideslope);
            papi[i].white.placemark.setVisibility(!belowGlideslope);
          });
        }.bind(this), 1000);
      };
      ges.fx.runway.refresh();
      clearInterval(t1);
    }
  }, 16);  
  
  // convert KTAS to KCAS
  var t2 = setInterval(function () {
    if (window.instruments && instruments.definitions) {
      ['airspeed', 'airspeedJet', 'airspeedSupersonic'].forEach(function (prop) {
        instruments.definitions[prop].overlay.overlays[0].animations[0].value = 'kcas';
      });
      clearInterval(t2);
    }
  }, 16);
  
  // ensure KCAS property is set
  setInterval(function () {
    if (window.ges && ges.aircraft && ges.aircraft.animationValue) {
      var animationValue = ges.aircraft.animationValue;
      animationValue.kcas = airspeedConversions.tasToCas(animationValue.ktas, animationValue.altitude * 0.3048);
    }
  }, 16);
    
  var pi = Math.PI;
  var degreesToRad = pi / 180;
  var radToDegrees = 180 / pi;
  var twoPi = pi * 2;
  
  /** 
   * @constructor
   * @description Creates a new PID instance.
   * @return {{ compute: function (number, number, number=, number=), reset: function () }}
   *  - compute: gets the value of the next PID output given an input, setpoint and time since last
   *  - reset: resets everything
   */
  function PID(kp, ti, td, min, max) {
    // default arguments
    if (typeof min !== 'number') min = -Infinity;
    else if (typeof max !== 'number') max = Infinity;
    // setup for closure
    var errorStream = this.errorStream = [];
    var inputStream = this.inputStream = [];
    // cache function
    var abs = Math.abs;
    
    function sum(arr) {
      var total = 0;
      for (var i = 0, l = arr.length; i < l; ++i) total += arr[i];
      return total;
    }
    
    // just for compatibility
    var _setPoint = 0;
    this.set = function (sp) {
      if (window.console) console[console.warn ? 'warn' : 'log']('[warning] PID.prototype.set is deprecated. ' +
                                                                 'Pass the setpoint to PID.prototype.compute instead.');
      _setPoint = sp;
    };
    this.compute = function (input, dt, setPoint, tracking) {
      // for compatibility reasons only
      if (typeof setPoint !== 'number') setPoint = _setPoint;
      
      var error = setPoint - input;
      errorStream.push(error * dt);
      var errorSum = sum(errorStream);
      
      // use derivative on measurement instead of derivative on error to prevent derivative kick
      // see http://brettbeauregard.com/blog/2011/04/improving-the-beginner%E2%80%99s-pid-derivative-kick
      var lastInput = inputStream[inputStream.length - 1];
      var dInput = (lastInput - input) / dt;
      inputStream.push(input);
      
      var proportional = error;
      var integral = ti * errorSum;
      var derivative = td * dInput;
      var output = kp * (proportional + integral + derivative);
      // correct integrator windup
      function diff(arg) {
        return (arg - output) / (kp * ti);
      }
      if (ti) {
        if (tracking) errorStream.push(diff(setPoint)); // we'll add something later
        else if (output > max) errorStream.push(diff(max));
        else if (output < min) errorStream.push(diff(min));
      }
      var correctedIntegral = kp * ti * sum(errorStream);
      return kp * (proportional + correctedIntegral + derivative);
    };
    this.reset = function () {
      errorStream = this.errorStream = [];
      inputStream = this.inputStream = [];
      _setPoint = 0;
    };
  }
  window.PID = PID;
  // fix up the look of bad "inputs"
  $('head').append(
    $('<style>').text(
      '.gefs-autopilot .input-prepend div,.gefs-autopilot .input-append div{margin-bottom:1px;display:inline-block}' +
      '.add-on.btn-warning{text-shadow:0 -1px 0 rgba(0,0,0,.25) !important}.Qantas94Heavy-ap-input{text-overflow:clip}'
    )
  );
  
  // will move to separate library soon, once I move to node build script
  var airspeedConversions = (function () {
    // Mohr, P. J., Taylor, B. N. & Newell, D. B. (2012). CODATA recommended values of the fundamental physical constants: 2010.
    var molar = 8.3144621;
    var avogardo = 6.02214129e23;
    var boltzmann = 1.3806487924497035e-23;

    // International Committee of Weights and Measures. (1901).
    // techically a bit high, but we'll use it anyway (meant to be 45 but actually 45.523... latitude)
    var gravity = 9.80665;

    // Gatley, D. P., Herrmann, S. & Kretzschmar, H.-J. (2008). A Twenty-First Century Molar Mass for Dry Air.
    // var airMass = 28.965369-3; // kilograms per mole

    // ICAO Standard Atmosphere (assumption based on 1.225kg/m3 @ SL)
    var airMass = 28.96491498930052e-3;

    // assumes diatomic molecules (adiabatic index)
    // relatively accurate, ranges from 1.3991 to 1.403 in real life
    var gamma = 1.4;

    // 1852 / 3600
    var knotsToMs = 463 / 900; 
    var msToKnots = 900 / 463;

    // specific gas constant of air -- equal to molar divided by air mass per mole
    var airGasConstant = molar / airMass;

    // @param {Number} temperature
    function speedOfSound(temperature) {
      if (typeof temperature !== 'number') return NaN;
      // gamma * airGasConstant * temperature
      return Math.sqrt(401.87402394586153 * temperature); // metres per second
    }

    // sea level defaults
    var machSL = speedOfSound(288.15);
    var densitySL = 1.225;
    var pressureSL = 101325;
    var temperatureSL = 288.15;

    // pascals, kelvin
    function airDensity(pressure, temperature) {
      return pressure / temperature / airGasConstant;
    }

    function mach(ktas, celsius) {
      return ktas * knotsToMs / speedOfSound(celsius + 273.15);
    }

    function tasToEas(ktas, density) {
      return ktas * Math.sqrt(density / densitySL);
    }
    // TEST: TODO (i.e. check this)
    function easToTas(keas, density) {
      return keas * Math.sqrt(densitySL / density);
    }

    //TAS = EAS * mach / (machSL * Math.sqrt(pressure / pressureSL));

    /**
     * Has the following signature: (altitude:Number)
     */
    // National Aeronautics and Space Administration. (1976). U.S. Standard Atmosphere.
    // TEST: PASS
    function standardConditions(altitude) {
      //altitude *= 0.3048;
      var exp = Math.exp;
      var min = Math.min;
      var pow = Math.pow;

      // this uses geopotential height -- not sure whether we should be using geometric or geopotential height
      var layers =
        [ [ 288.15, 0, -0.0065 ]
        , [ 216.65, 11000, 0 ]
        , [ 216.65, 20000, 0.001 ]
        , [ 228.65, 32000, 0.0028 ]
        , [ 270.65, 47000, 0 ]
        , [ 270.65, 51000, -0.0028 ]
        , [ 214.65, 71000, -0.002 ]
        , [ 186.946, 84852, 0 ]
        ];

      return layers.reduce(function (pressure, currentLayer, i, arr) {
        var baseTemperature = currentLayer[0];
        var layerHeight = currentLayer[1];
        var nextLayerHeight = arr[Math.min(i + 1, arr.length - 1)][1];
        var lapseRate = currentLayer[2];
        var newTemperature = baseTemperature + (Math.min(altitude, nextLayerHeight) - layerHeight) * lapseRate;
        var newPressure;
        if (lapseRate === 0) newPressure = pressure * exp(
          -gravity * airMass * (min(altitude, nextLayerHeight) - layerHeight) / molar / baseTemperature
        );
        else newPressure = pressure * pow(baseTemperature / newTemperature, gravity * airMass / molar / lapseRate);

        if (nextLayerHeight >= altitude && !Array.isArray(pressure)) return [ newPressure, newTemperature ];
        return pressure;
      }, 101325);
    }

    /**
     * @description Converts KTAS to KCAS, either with altitude, or pressure and temperature.
     * (ktas:Number, altitude:Number)
     * (ktas:Number, pressure:Number, temperature:Number)
     */
    // TEST: PASS
    function tasToCas(ktas, pressure, temperature) {
      // second argument is altitude, not pressure
      if (arguments.length === 2) {
        var altitude = pressure;
        var condition = standardConditions(altitude);
        pressure = condition[0];
        temperature = condition[1];
      }

      // mach one at sea level
      var A0 = machSL * msToKnots;
      // sea level pressure
      var P0 = pressureSL;
      var P = pressure;
      // sea level temperature
      var T0 = temperatureSL;
      var T = temperature;

      var sqrt = Math.sqrt;
      var pow = Math.pow;

      // formula assumes gamma = 1.4
      // how does this take into account compressibility (it apparently does)?

      // impact pressure
      var Qc = P * (pow((T0 * ktas * ktas) / (5 * T * A0 * A0) + 1, 7 / 2) - 1);
      // subsonic compressible flow formula
      return A0 * sqrt(5 * (pow(Qc / P0 + 1, 2 / 7) - 1));
    }

    function casToTas(kcas, pressure, temperature) {
      // check if second argument is altitude (instead of pressure)
      if (arguments.length === 2) {
        var altitude = pressure;
        var condition = standardConditions(altitude);
        pressure = condition[0];
        temperature = condition[1];
      }

      // mach one at sea level
      var A0 = machSL * msToKnots;
      // sea level pressure
      var P0 = pressureSL;
      var P = pressure;
      // sea level temperature
      var T0 = temperatureSL;
      var T = temperature;

      var sqrt = Math.sqrt;
      var pow = Math.pow;

      // formula assumes gamma = 1.4
      // how does this take into account compressibility (it apparently does)?

      // impact pressure
      var Qc = P0 * (pow(kcas * kcas / (5 * A0 * A0) + 1, 7 / 2) - 1);
      return A0 * sqrt(5 * T / T0 * (pow(Qc / P + 1, 2 / 7) - 1));
    }

    function easToCas(keas, pressure, temperature) {
      // check if second argument is altitude (instead of pressure)
      if (arguments.length === 2) {
        // pressure is actually altitude
        var condition = standardConditions(pressure);
        pressure = condition[0];
        temperature = condition[1];
      }

      // mach one at sea level
      var A0 = machSL * msToKnots;
      // sea level pressure
      var P0 = pressureSL;
      var P = pressure;
      // sea level temperature
      var T0 = temperatureSL;
      var T = temperature;

      var sqrt = Math.sqrt;
      var pow = Math.pow;

      // formula assumes gamma = 1.4
      // how does this take into account compressibility (it apparently does)?

      // impact pressure
      var Qc = keas * keas * P0 / 2;
      return A0 * sqrt(5 * (pow(Qc / P0 + 1, 2 / 7) - 1));
    }

    function casToEas(kcas, pressure, temperature) {
      // check if second argument is altitude (instead of pressure)
      if (arguments.length === 2) {
        var altitude = pressure;
        var condition = standardConditions(altitude);
        pressure = condition[0];
        temperature = condition[1];
      }

      // mach one at sea level
      var A0 = machSL * msToKnots;
      // sea level pressure
      var P0 = pressureSL;
      var P = pressure;
      // sea level temperature
      var T0 = temperatureSL;
      var T = temperature;

      var sqrt = Math.sqrt;
      var pow = Math.pow;

      // formula assumes gamma = 1.4
      // how does this take into account compressibility (it apparently does)?

      // impact pressure
      var Qc = P0 * (pow((kcas * kcas) / (5 * A0 * A0) + 1, 7 / 2) - 1);
      return Math.sqrt(2 * Qc / P0);
    }

    var airspeed =
      { speedOfSound: speedOfSound
      , mach: mach
      , airDensity: airDensity
      , standardConditions: standardConditions
      , tasToCas: tasToCas
      , casToTas: casToTas
      , tasToEas: tasToEas
      , easToTas: easToTas
      };
    return airspeed;
  })();  
  
  // bug fix for longitude issue
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
  
  var decimalsOnly = /^[+-]?\d+\.?\d*$/;
  var wholeNumbersOnly = /^[+-]?\d+$/;
  
  var enabled =
    { heading: false
    , altitude: false
    , speed: false
    };
  var altitudeChanged = false;
  
  var autopilot = controls.autopilot =
    { setHeading: function (heading) {
        var newHdg = fixAngle360(parseInt(heading, 10));
        $('.gefs-autopilot-heading').val(isFinite(newHdg) ? autopilot.heading = newHdg : autopilot.heading); // deliberate assignment
      }
    , setAltitude: function (altitude) {
        var newAlt = parseInt(altitude, 10);
        $('.gefs-autopilot-altitude').val(isFinite(newAlt) ? autopilot.altitude = newAlt : autopilot.altitude); // deliberate assignment
      }
    , setKias: function (kias) {
        var newSpd = parseInt(kias, 10);
        $('.gefs-autopilot-kias').val(isFinite(newSpd) ? autopilot.kias = newSpd : autopilot.kias); // deliberate assignment
      }
    , setVs: function (vs) {
        var newVs = parseInt(vs, 10);
        // check new speed is not NaN
        // deliberate assignment
        $('#Qantas94Heavy-gc-vs').val(isFinite(newVs) ? autopilot.climbrate = newVs : vs === '' ? autopilot.climbrate = '' : autopilot.climbrate);
      }
    , update: (function () {
        var abs = Math.abs;
        var max = Math.max;
        var min = Math.min;
        var arctan = Math.atan;
        var lastAileronPosition, lastElevatorPosition;
        return function (dt) {
          var values = ges.aircraft.animationValue;
          
          // calculate relative speed of aircraft as correction factor
          var speedRatio = clamp(values.kias / 100, 1, 5);
          
          // ensure autopilot not used if we're below 500ft AGL - turn off AP if that's the case and other extreme flight conditions
          if (!DEBUG && (values.altitude - max(ges.groundElevation * metersToFeet, -1000) < 500 ||
                         ui.hud.stallAlarmOn || abs(values.aroll) > 45 ||
                         values.atilt > 20 || values.atilt < -35)) return void autopilot.turnOff();
  
          // elevator setting, altitude/vertical speed mode
          function updateAltitude() {
            // make sure autopilot starts in trim
            if (altitudeChanged !== enabled.altitude) {
              controls.elevatorTrim = clamp(controls.pitch, controls.elevatorTrimMin, controls.elevatorTrimMax);
              controls.rawPitch = 0;
              altitudeChanged = true;
              var startTime = Date.now();
              var originalTrim = controls.elevatorTrim;
              var resetTrim = setInterval(function () {
                var timeSince = Date.now() - startTime;
                if (timeSince >= 5000) {
                  clearInterval(resetTrim);
                  controls.elevatorTrim = 0;
                  return;
                }
                controls.elevatorTrim = originalTrim * (1 - timeSince / 5000);
              }, 50);
            }
            var deltaAltitude = autopilot.altitude - values.altitude;
            var maxClimbRate = clamp(speedRatio * autopilot.commonClimbrate, 0, autopilot.maxClimbrate);
            var maxDescentRate = clamp(speedRatio * autopilot.commonDescentrate, autopilot.maxDescentrate, 0);
            var vsInput = $('#Qantas94Heavy-gc-vs');
            var vsValue = vsInput.val();
            var targetClimbrate;
            // check if vertical speed manually set
            if (typeof autopilot.climbrate === 'number' && isFinite(autopilot.climbrate)) {
              if (autopilot.climbrate === 0) {
                // force vertical speed to be 0
                targetClimbrate = 0;
                if (vsValue !== '0' && !vsInputFocused) vsInput.val('0');
              } else if (autopilot.climbrate < 0 ? deltaAltitude < -200 : deltaAltitude > 200) {
                // check that vertical speed is in right direction to altitude
                targetClimbrate = autopilot.climbrate;
                if (vsValue !== targetClimbrate + '' && !vsInputFocused) vsInput.val(targetClimbrate + '');
              } else {
                // automatically calculate vertical speed
                targetClimbrate = clamp(deltaAltitude * 2.5, maxDescentRate, maxClimbRate);
                if (vsValue !== '' && !vsInputFocused) vsInput.val('');
              }
            } else {
              // automatically calculate vertical speed
              targetClimbrate = clamp(deltaAltitude * 2.5, maxDescentRate, maxClimbRate);
              if (vsValue !== '' && !vsInputFocused) vsInput.val('');
            }
            
            var aTargetTilt = autopilot.climbPID.compute(values.climbrate, dt, targetClimbrate);
            aTargetTilt = clamp(aTargetTilt, autopilot.minPitchAngle, autopilot.maxPitchAngle);
            
            if (+aTargetTilt !== +aTargetTilt) {
              console.log('aTargetTilt: ' + aTargetTilt);
              console.log(values.climbrate);
              console.log(dt, targetClimbrate);
            }
  
            var result = autopilot.pitchPID.compute(-values.atilt, dt, aTargetTilt);
            console.warn(result);
            controls.rawPitch = exponentialSmoothing('apPitch', result / speedRatio, 0.9);
            // add an elevator deflection rate limiter

            ges.debug.watch('targetClimbrate', targetClimbrate);
            ges.debug.watch('aTargetTilt', aTargetTilt);
          }
          
          // set aileron/rudder, heading mode
          function updateHeading() {
            // difference in target/current headings, bound to range -180 to 180 degrees
            var deltaHeading = fixAngle(values.heading - autopilot.heading); 
            // double standard rate turn or max bank angle, whichever is less
            var maxBankAngle = min(arctan(0.0027467328927254283 * values.ktas) * radToDegrees, autopilot.maxBankAngle);
            // bank angle equal to difference in headings, up to limit (10° heading = 10° bank)
            var targetBankAngle = clamp(deltaHeading, -maxBankAngle, maxBankAngle);
            
            // rudder equal to half the aileron deflection
            controls.yaw = exponentialSmoothing('apYaw', values.roll / 2, 0.1);
            
            var result = -autopilot.rollPID.compute(values.aroll, dt, targetBankAngle);
            controls.roll = exponentialSmoothing('apRoll', result / speedRatio, 0.9);
            // 100% haxoring, A380 ailerons suck
            if (ges.aircraft.name === 'a380') controls.roll *= 3.5;
            
            // add an aileron deflection rate limiter
          }
  
          function updateThrottle() {
            var result = autopilot.throttlePID.compute(values.kcas, dt, autopilot.kias);
            controls.throttle = clamp(exponentialSmoothing('apThrottle', result, 0.9), 0, 1);
            ges.debug.watch('throttle', controls.throttle);
          }
          if (enabled.heading) updateHeading();
          if (enabled.altitude) updateAltitude();
          if (enabled.speed) updateThrottle();
        };
      })()
    , turnOn: function () {
        if (!ges.aircraft.setup.autopilot) return;
        autopilot.climbPID.reset();
        autopilot.pitchPID.reset();
        autopilot.rollPID.reset();
        autopilot.throttlePID.reset();
        autopilot.setAltitude($('.gefs-autopilot-altitude').val());
        autopilot.setHeading($('.gefs-autopilot-heading').val());
        autopilot.setKias($('.gefs-autopilot-kias').val());
        ui.hud.autopilotIndicator(autopilot.on = true); // deliberate assignment
        $('.gefs-autopilot-toggle')
          .first()
          .text('Engaged')
          .addClass('btn-warning');
        if (!enabled.heading && (mode === 'GC mode (lat/long)' || mode === 'Great Circle (ICAO)')) {
          enabled.heading = true;
          $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
        }
      }
    , turnOff: function () {
        ui.hud.autopilotIndicator(autopilot.on = false); // deliberate assignment
        $('.gefs-autopilot-toggle')
          .first()
          .text('Disengaged')
          .removeClass('btn-warning');
        enabled =
          { heading: false
          , altitude: false
          , speed: false
          };
        altitudeChanged = false;
        $('#Qantas94Heavy-ap-alt, #Qantas94Heavy-ap-hdg, #Qantas94Heavy-ap-spd').removeClass('btn-warning');
        audio.playSoundLoop('apDisconnect', 1);
      }
    , toggle: function () {
        autopilot[autopilot.on ? 'turnOff' : 'turnOn']();
      }
    , on: false
    , maxBankAngle: 25
    , maxPitchAngle: 10
    , minPitchAngle: -20
    , commonClimbrate: 500
    , commonDescentrate: -750
    , maxClimbrate: 3000
    , maxDescentrate: -4000
    , heading: 0
    , altitude: 0
    , kias: 0
    , climbrate: null
    // PID gains should be moved to aircraft configuration files
    , climbPID: new PID(0.01, 0.05, 0.005, -20, 10)
    , pitchPID: new PID(0.02, 0.5, 0.05, -1, 1)
    , rollPID: new PID(0.02, 0.01, 0.01, -1, 1)
    , throttlePID: new PID(0.01, 0.5, 0.5, 0, 1)
    };
  var apDisconnectSound =
    { id: 'apDisconnect'
    , file: 'http://dl.dropbox.com/s/uyqz78wget1tetj/test3.mp3'
    };
  V3.duplicate = V3.dup;
  Aircraft.prototype.load = function (aircraftName, coordinates, justReload) {
    var href = PAGE_PATH + (aircraftName.indexOf('/') !== -1 ?
                            aircraftName + '/aircraft.kml?killcache=' :
                            'models/aircrafts/' + aircraftName + '/' + aircraftName + (ges.PRODUCTION ?
                                                                                       '.kmz?killcache=' :
                                                                                       '-kmz/aircraft.kml?killcache=')
                           ) + ges.killCache;
    this._cockpitLoaded = false;
    google.earth.fetchKml(ge, href, function (kmlObject) {
      if (kmlObject) {
        var aircraft = ges.aircraft;
        try {
          // indirect eval call -- prevents access to local scope
          aircraft.setup = (0, eval)(kmlObject.getDescription())[0];
        } catch (e) {
          ges.debug.alert('Error loading aircraft: ' + e);
          ges.undoPause();
        }
        aircraft.controllers =
          { pitch:
            { recenter: false
            , sensitivity: 1
            , ratio: 1
            }
          , roll:
            { recenter: true
            , sensitivity: 1
            , ratio: 1
            }
          , yaw:
            { recenter: true
            , sensitivity: 1
            , ratio: 1
            }
          };
        aircraft.unloadAircraft();
        aircraft.name = aircraftName;
        aircraft.parts = {};
        aircraft.airfoils = [];
        aircraft.engines = [];
        aircraft.buoys = [];
        aircraft.wheels = [];
        aircraft.collisionPoints = [];
        aircraft.lights = [];
        if (!aircraft.setup.scale) aircraft.setup.scale = 1;
        if (!aircraft.setup.startupTime) aircraft.setup.startupTime = 0;
        if (!aircraft.setup.com) aircraft.setup.com = [0, 0, 0];
        aircraft.setup.startAltitude *= aircraft.setup.scale;
        if (!aircraft.setup.cockpitScaleFix) aircraft.setup.cockpitScaleFix = 1;
        for (var i in aircraft.setup.cameras) {
          var definition = aircraft.setup.cameras[i];
          definition.distance *= aircraft.setup.scale;
          if (definition.position) definition.position = V3.scale(definition.position, aircraft.setup.scale);
        }
        aircraft.placemarks = {};
        aircraft.kmlObjects = [];
        var root =
          { name: 'root'
          , position: aircraft.setup.com
          };
        aircraft.object3d = new Object3D(root);
        aircraft.addParts(aircraft.setup.parts, kmlObject, aircraft.setup.scale);
        aircraft.boundingSphereRadius = 0;
        for (var i = 0, l = aircraft.collisionPoints.length; i < l; ++i) {
          aircraft.boundingSphereRadius = Math.max(aircraft.boundingSphereRadius, V3.length(aircraft.collisionPoints[i]));
        }
        aircraft.boundingSphereRadius *= 1.5;
        for (var i in aircraft.setup.contactProperties) {
          var contact = aircraft.setup.contactProperties[i];
          if (!contact.lockSpeed) contact.lockSpeed = 0.01;
        }
        aircraft.object3d.render(
        { llaCoordinates: aircraft.llaLocation
        , collisions: true
        });
        for (var i = 0, l = aircraft.setup.parts.length; i < l; ++i) {
          var part = aircraft.setup.parts[i];
          if (part.suspension) {
            part.suspension.origin = [part.collisionPoints[0][0], part.collisionPoints[0][1], 0];
            var suspensionHeight = -part.collisionPoints[0][2];
            part.suspension.restLength = suspensionHeight;
            if (part.suspension.motion === 'rotation') {
              var rotationRadius = V3.length(part.collisionPoints[0]);
              var restAngle = Math.atan2(part.collisionPoints[0][0] / rotationRadius, part.collisionPoints[0][2] / rotationRadius);
              var deltaAngle = restAngle < 0 ? restAngle + halfPi : restAngle - halfPi;
              part.suspension.motionFactor = deltaAngle / part.suspension.restLength;
              part.suspension.rotationMethod = 'setRotation' + (part.suspension.axis || 'Y');
            }
            if (!part.suspension.hardPoint) part.suspension.hardPoint = part.suspension.restLength * 0.5;
            part.points.origin = V3.duplicate(part.suspension.origin);
            part.points.suspensionOrigin = V3.duplicate(part.suspension.origin);
          }
        }
        if (!aircraft.rigidBody) aircraft.rigidBody = new rigidBody;
        aircraft.rigidBody.setMassProps(aircraft.setup.mass, aircraft.setup.tensorFactor);
        aircraft.setup.RPM2PropAS = aircraft.setup.driveRatio * 6;
        aircraft.engine.invRPMRange = 1 / (aircraft.setup.maxRPM - aircraft.setup.minRPM);
        aircraft.shadow = ge.createGroundOverlay('');
        aircraft.shadow.setIcon(ge.createIcon(''));
        aircraft.shadow.setLatLonBox(ge.createLatLonBox(''));
        aircraft.shadow.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_SEA_FLOOR);
        aircraft.shadow.getIcon().setHref(aircraft.setup.shadowURL);
        aircraft.shadow.setVisibility(true);
        ge.getFeatures().appendChild(aircraft.shadow);
        aircraft.shadowBox = aircraft.setup.shadowBox;
        aircraft.shadowBox[2] = 0;
        aircraft.shadowBox = V3.scale(aircraft.shadowBox, aircraft.setup.scale);
        instruments.init(aircraft.setup.instruments);
        aircraft.setup.sounds.push(apDisconnectSound);
        audio.init(aircraft.setup.soundSet, aircraft.setup.sounds);
        ges.preferences.aircraft = aircraftName;
        // adjust unrealistic settings
        if (typeof aircraft.setup.airbrakesTravelTime === 'number') aircraft.setup.airbrakesTravelTime = 1;
        aircraft.setup.brakeDamping = 5;
        if (!aircraft.setup.autopilot) autopilot.turnOff();
        // set thrust for each engine to be read-only properties, if supported
        var READ_ONLY =
          { configurable: true
          , enumerable: true
          , writable: false
          };
        if (Object.defineProperties) {
          for (var i = 0, engines = aircraft.engines, l = engines.length; i < l; ++i) Object.defineProperties(engines[i], {
            thrust: READ_ONLY,
            reverseThrust: READ_ONLY,
            afterBurnerThrust: READ_ONLY
          });
        }
        ges.flyTo(coordinates, justReload);
      } else {
        alert('Error loading aircraft file');
        ges.undoPause();
      }
    });
  };
  
  // create global great circle public interface
  (function gcInit() {
    // make sure ges.aircraft exists - if not try again later
    if (!(typeof ges === 'object' && ges.aircraft && ges.aircraft.setup)) {
      setTimeout(gcInit, 100);
      return;
    }
    
    var timer, lat, lon;
    var status = 'off';
    var aircraft = ges.aircraft;
    var atan2 = Math.atan2;
    var sin = Math.sin;
    var cos = Math.cos;
    // arg1, [arg2, ...argN]
    function isNumber(arg1) {
      return !!arguments.length && Array.prototype.every.call(arguments, function (val) {
        return typeof val === 'number';
      });
    }

    function setHeading() {
      if (isNumber(lat, lon)) autopilot.setHeading(Math.round(gc.getHeading(lat, lon)));
    }
    var setTimer;
    // while we're at it, let's add a flight spoiler mode
    controls.setters.setAirbrakes.set = function () {
      var airbrakes = controls.airbrakes;
      var ground = ges.aircraft.groundContact;
      if (airbrakes.target === 0) {
        airbrakes.target = ground ? 1 : 0.5;
        if (!setTimer) setTimer = setInterval(function () {
          if (ges.aircraft.groundContact !== ground) {
            airbrakes.target = ges.aircraft.groundContact ? 1 : 0.5;
            controls.setPartAnimationDelta(airbrakes);
            ground = ges.aircraft.groundContact;
          }
        }, 100);
      } else {
        airbrakes.target = 0;
        clearInterval(setTimer);
        setTimer = null;
      }
      controls.setPartAnimationDelta(airbrakes);
    };
    
    // create public interface for great circle function
    /* global gc */
    window.gc =
      { on: function () {
          clearInterval(timer);
          timer = setInterval(setHeading, 1000);
          status = 'on';
        }
      , off: function () {
          clearInterval(timer);
          timer = null;
          status = 'off';
        }
      , getLatitude: function () {
          return +lat;
        }
      , getLongitude: function () {
          return +lon;
        }
      , getHeading: function () {
          var coords = aircraft.getCurrentCoordinates();
          var lat1 = coords[0] * degreesToRad;
          var lon1 = coords[1] * degreesToRad;
          var lat2 = lat * degreesToRad;
          var lon2 = lon * degreesToRad;
          return fixAngle360(
            atan2(
              sin(lon2 - lon1) * cos(lat2),
              cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lon2 - lon1)
            ) % twoPi * radToDegrees
          );
        }
      , getStatus: function () {
          return status;
        }
      , setLatitude: function (newLat, calledByInput) {
          if (decimalsOnly.test(newLat)) lat = clamp(parseFloat(newLat), -90, 90);
          if (calledByInput) $('#Qantas94Heavy-gc-lat').val(lat + '');
        }
      , setLongitude: function (newLon, calledByInput) {
          if (decimalsOnly.test(newLon)) lon = clamp(parseFloat(newLon), -180, 180);
          if (calledByInput) $('#Qantas94Heavy-gc-lon').val(lon + '');
        }
      };
  })();
  
  /* MAKE THE USER INTERFACE */
  // set ` key for autopilot disconnect, like the red sidestick button
  $(document).keydown(function (e) {
    if (e.which === 192) autopilot.turnOff();
  });
  var mode = 'Heading mode'; // allow referencing current mode when toggling
  var hdgDiv = $('<div>') // recreating heading div with HTML5 number type
    .addClass('input-prepend input-append')
    .append(
      $('<span>')
        .attr('id', 'Qantas94Heavy-ap-hdg')
        .addClass('add-on')
        .text('Hdg.')
        .click(function () {
          enabled.heading = autopilot.on ? !enabled.heading : false;
          $(this)[enabled.heading ? 'addClass' : 'removeClass']('btn-warning');
        }),
      $('<input>')
        .attr('type', 'number')
        .addClass('gefs-autopilot-heading')
        .width('146px')
        .change(function () {
          autopilot.setHeading(this.value);
        }),
      $('<span>')
        .addClass('add-on')
        .text('deg.')
    );
  // remove and replace heading div - jQuery older than 1.9 does not allow changing type of input
  $('.gefs-autopilot-heading')
    .parent()
    .replaceWith(hdgDiv);
  
  var machHold = false;
  var spdDiv = $('<div>') // recreating speed div with HTML5 number type
    .addClass('input-prepend input-append')
    .append(
      $('<span id="Qantas94Heavy-ap-spd" class="add-on">Spd.</span>').click(function () {
        enabled.speed = autopilot.on ? !enabled.speed : false; // toggle only if autopilot is on
        $(this)[enabled.speed ? 'addClass' : 'removeClass']('btn-warning');
      }),
      $('<input type="number" class="gefs-autopilot-kias">')
        .width('146px')
        .change(function () {
          autopilot.setKias(this.value);
        }),
      $('<span class="add-on">kts.</span>').click(function () {
        machHold = !machHold; // toggle boolean
        this.value = machHold ? 'M.' : 'kts.';
      })
    );
  $('.gefs-autopilot-kias')
    .parent()
    .replaceWith(spdDiv);
  var vsInputFocused = false; // check for focus on vertical speed input
  // is this not too complicated? :O
  var altDiv = $('<div>')
    .append(
      $('<div>') // recreating altitude div with HTML5 number type
        .addClass('input-prepend')
        .css('float', 'left')
        .css('margin', '0 5px 0 0')
        .append(
          $('<span>')
            .attr('id', 'Qantas94Heavy-ap-alt')
            .addClass('add-on')
            .text('Alt.')
            .click(function () {
              enabled.altitude = autopilot.on ? !enabled.altitude : false;
              $(this)[enabled.altitude ? 'addClass' : 'removeClass']('btn-warning');
              altitudeChanged = false;
            }),
          $('<input>')
            .attr('type', 'number')
            .addClass('gefs-autopilot-altitude Qantas94Heavy-ap-input')
            .css('width', '66px')
            .change(function () {
              autopilot.setAltitude(this.value);
            })
        ),
      $('<div>') // add V/S info
        .addClass('input-prepend')
        .css('float', 'right')
        .css('margin', '0 0 0 6px')
        .append(
          $('<span>')
            .addClass('add-on')
            .text('V/S.'),
          $('<input>')
            .attr('type', 'number')
            .prop('id', 'Qantas94Heavy-gc-vs')
            .prop('step', '100')
            .addClass('Qantas94Heavy-ap-input')
            .css('width', '54px')
            .change(function () {
              autopilot.setVs(this.value);
            })
            .focus(function () {
              vsInputFocused = true;
            })
            .blur(function () {
              vsInputFocused = false;
            })
        )
    )
    .css('display', 'inline-block')
    .css('margin-bottom', '-1px');
  // do the same with altitude div
  $('.gefs-autopilot-altitude')
    .parent()
    .replaceWith(altDiv);
  
  // reference autopilot toggle button so that we can move it to outer div
  var onOff = $('.gefs-autopilot-toggle')
    .css('margin', '0 5% 5px')
    .width('40%');
  
  // create heading/great circle mode toggle button
  var gcOrHdg = $('<button class="btn btn-mini gefs-autopilot-toggle" style="margin:0 5% 5px">Heading mode</button>')
    .width('40%')
    .click(function () { // TODO: refactor this, too ugly
      if (mode === 'Heading mode') {
        hdgDiv.hide();
        gcDiv.css('display', 'inline-block');
        icaoDiv.hide();
        gcOrHdg.text(mode = 'GC mode (lat/long)'); // deliberate assignment
        gc.on();
      } else if (mode === 'GC mode (lat/long)') {
        hdgDiv.hide();
        gcDiv.hide();
        icaoDiv.css('display', 'block');
        gcOrHdg.text(mode = 'Great Circle (ICAO)'); // deliberate assignment
      } else {
        hdgDiv.css('display', 'block');
        gcDiv.hide();
        icaoDiv.hide();
        gcOrHdg.text(mode = 'Heading mode'); // deliberate assignment
        gc.off();
      }
    });
  
  // create container to store both buttons and append them to it
  var btnDiv = $('<div style="display:inline-block">')
    .width('100%')
    .append(onOff, gcOrHdg)
    .insertAfter('.gefs-autopilot > h6');
  
  // latitude div container
  var latDiv = $('<div class="input-prepend" style="margin: 0 5px 0 0; float: left;">').append(
    $('<span class="add-on">Lat.</span>'),
    $('<input id="Qantas94Heavy-gc-lat" type="text" class="Qantas94Heavy-ap-input" style="width:56px">').change(function () {
      if (!enabled.heading) {
        enabled.heading = true;
        $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
      }
      gc.setLatitude(this.value, true);
    })
  );
  
  // longitude div container
  var lonDiv = $('<div>')
    .addClass('input-prepend')
    .css('margin', '0 0 0 5px')
    .css('float', 'right')
    .append(
      $('<span class="add-on">Lon.</span>'),
      $('<input id="Qantas94Heavy-gc-lon" type="text" class="Qantas94Heavy-ap-input" style="width: 65px;">').change(function () {
        if (!enabled.heading) {
          enabled.heading = true;
          $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
        }
        gc.setLongitude(this.value, true);
      })
    );
  
  /* PUT EVERYTHING TOGETHER */
  // create container to store lat and lon inputs and append them
  var gcDiv = $('<div style="margin-bottom:-1px"></div>')
    .append(latDiv, lonDiv)
    .insertAfter(hdgDiv)
    .hide();
  
  // allow ICAO airport codes input
  function stopPropagation(event) {
    event.stopPropagation();
  }
  var icaoDiv = $('<div class="input-prepend input-append"></div>')
    .append(
      $('<span class="add-on">Arpt.</span>'),
      $('<input id="Qantas94Heavy-gc-icao" type="text" class="Qantas94Heavy-ap-input" style="width:146px">')
        .keydown(stopPropagation)
        .keyup(stopPropagation)
        .change(function () {
          // possible switch to AJAX for ICAO codes?
          /* global icaos*/
          if (typeof icaos === 'undefined') {
            alert('ICAO codes loading, please wait...');
            return;
          }
          var $this = $(this);
          var inputVal = $this.val();
          var code = inputVal.trim().toUpperCase(); // ICAO characters are uppercase      
          if (icaos[code]) {
            if (!enabled.heading) {
              enabled.heading = true;
              $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
            }
            gc.setLatitude(icaos[code][0], true);
            gc.setLongitude(icaos[code][1], true);
            if (inputVal !== code) $this.val(code);
          } else {
            $this.val('');
            alert('Sorry, code "' + inputVal + '" is an invalid or unrecognised ICAO airport code.');
          }
        }),
      $('<span class="add-on">ICAO</span>')
    )
    .insertAfter(hdgDiv)
    .hide();
})(this, true); // DEBUG is changed to false by build script