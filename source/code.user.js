// ==UserScript==
// @name Autopilot++ for GEFS-Online
// @description This extension (by Qantas 94 Heavy) takes the GEFS autopilot to the next level!
// @namespace http://www.eyredaero.frihost.org
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.5.0.45
// @grant none
// ==/UserScript==

// NOTE: since we are only releasing this plugin for Chrome and Firefox (soon!), ES3 compatibility will be no longer be maintained.

// uglifyjs does not like the use of var, so we have to use window

(function (window)
{  if (typeof DEBUG === 'undefined') window.DEBUG = true;
   function replacePapiFunction()
   {  ges.fx.RunwayLights.prototype.refreshPapi = function () // fix papi angle
      {  this.papiInterval = setInterval(function ()
         {  var collResult = ges.getGroundAltitude(this.papiLocation[0], this.papiLocation[1]);
            this.papiLocation[2] = collResult.location[2];
            var relativeAicraftLla = [ges.aircraft.llaLocation[0], ges.aircraft.llaLocation[1], this.papiLocation[2]];
            var distance = V3.length(lla2xyz(V3.sub(relativeAicraftLla, this.papiLocation), this.papiLocation));
            var height = ges.aircraft.llaLocation[2] - this.papiLocation[2];
            var slope = Math.atan2(height, distance) * radToDegrees;
            
            // assumes 3 degree glideslope
            var tooLow = slope < 15 / 6; // 30' below glideslope
            var slightlyLow = slope < 17 / 6; // 10' below glideslope
            var slightlyHigh = slope < 19 / 6; // 10' above glideslope
            var tooHigh = slope < 21 / 6; // 30' above glideslope
            
            var papi = this.papy;
            papi[3].white.placemark.setVisibility(!tooLow);
            papi[3].red.placemark.setVisibility(tooLow);
            papi[2].white.placemark.setVisibility(!slightlyLow);
            papi[2].red.placemark.setVisibility(slightlyLow);
            papi[1].white.placemark.setVisibility(!slightlyHigh);
            papi[1].red.placemark.setVisibility(slightlyHigh);
            papi[0].white.placemark.setVisibility(!tooHigh);
            papi[0].red.placemark.setVisibility(tooHigh);
         }.bind(this), 1000);
      };
   }
   
   var t1 = setInterval(function ()
   {  if (window.ges && ges.fx && ges.fx.RunwayLights)
      {  clearInterval(t1);
         if (ges.fx.RunwayLights.prototype.refreshPapi) replacePapiFunction();
         else Object.defineProperty(ges.fx.RunwayLights.prototype, 'refreshPapi',
         { configurable: true
         , enumerable: true
         , set: replacePapiFunction
         });
      }
   }, 0); // will be adjusted to minimum timer possible
})(this);

// no need for $(function(){}) as already checked by Greasemonkey
(function main(Infinity, NaN, undefined)
{  'use strict';   
   if (typeof controls !== 'object')
   {  setTimeout(function () { main(Infinity, NaN); }, 10); // Infinity/NaN are both already set properly
      return;
   }
   
   var pi = Math.PI;
   var degreesToRad = pi / 180;
   var radToDegrees = 180 / pi;
   var twoPi = pi * 2;

   function PID(kp, ki, kd, min, max)
   {  /** constructor that creates a new PID instance. Contains the following properties:
        *   - compute: gets the value of the next PID output given an input, setpoint and time since last
        *   - reset: resets everything
      */

      // default arguments
      if (!kp) kp = 0;
      if (!ki) ki = 0;
      if (!kd) kd = 0;
      if (typeof min !== 'number') min = -Infinity;
      else if (typeof max !== 'number') max = Infinity;

      // setup for closure
      var errorStream = [];
      
      // cache function
      var abs = Math.abs;
      var sumcallback = function (previous, current) { return previous + current; }
       
       // two ways of doing the same thing
      function sum(arr) { return Array.prototype.reduce.call(arr, sumcallback); }
       
      function sum(arr)
      {  var total = 0;
         for (var i = 0, l = arr.length; i < l; ++i) total += arr[i];
         return total;
      }
      
      // just for compatibility
      var _setPoint = 0;
      this.set = function (sp)
      {  if (window.console) console[console.warn ? 'warn' : 'log']('[warning] PID.prototype.set is depreceated. Pass the setpoint to PID.prototype.compute instead.');
         _setPoint = sp;
      };
      
      var lastInput = 0; // bandaid until I can fix this
      
      this.compute = function (input, dt, setPoint, tracking)
      {  // compatibility reasons
         if (typeof setPoint !== 'number') setPoint = _setPoint;
        
         var error = setPoint - input;
         errorStream.push(error * dt);
         
         // use derivative on measurement instead of derivative on error to prevent derivative kick
           // see http://brettbeauregard.com/blog/2011/04/improving-the-beginner%E2%80%99s-pid-derivative-kick
         var dInput = -(input - lastInput) / dt;
         lastInput = input;
         
         var errorSum = sum(errorStream);
         var proportional = kp * error;
         var integral = ki * errorSum;
         var derivative = kd * dInput;
           
         var output = proportional + integral + derivative;
         
         // correct integrator windup
         if (ki)
            if (tracking) errorStream.push(-(output - setPoint) / ki); // we'll add something later
            else if (output > max) errorStream.push(-(output - max) / ki);
            else if (output < min) errorStream.push(-(output - min) / ki);
         var correctedIntegral = ki * sum(errorStream);
         
         return proportional + correctedIntegral + derivative;
      };
      
      this.reset = function ()
      {  errorStream = [];
         _setPoint = 0;
      };
   }
   window.PID = PID;
   
   // fix up the look of bad "inputs"
   $('head').append(
      $('<style>').text(
         '.gefs-autopilot .input-prepend div,.gefs-autopilot .input-append div{margin-bottom:1px;display:inline-block}.add-on.btn-warning{text-shadow:0 -1px 0 rgba(0,0,0,.25) !important}.Qantas94Heavy-ap-input{text-overflow:clip}'
      )
   );
   
   // bug fix for longitude issue
   rigidBody.prototype.integrateTransform = function (s_step)
   {  var aircraft = ges.aircraft;
      var llaTranslation = xyz2lla(V3.scale(this.v_linearVelocity, s_step), aircraft.llaLocation);
      aircraft.llaLocation = V3.add(aircraft.llaLocation, llaTranslation);
      aircraft.llaLocation[1] = fixAngle(aircraft.llaLocation[1]);
      var rot = M33.transformByTranspose(aircraft.object3d._rotation, V3.scale(this.v_angularVelocity, s_step));
      aircraft.object3d.rotate(rot);
      this.v_resultForce = V3.sub(this.v_linearVelocity, this.v_prevLinearVelocity);
      this.v_resultTorque = V3.sub(this.v_angularVelocity, this.v_prevTotalTorque);
      this.v_prevLinearVelocity = V3.dup(this.v_linearVelocity);
      this.v_prevTotalTorque = V3.dup(this.v_angularVelocity);
      this.clearForces();
   };
   
   // fix up the GEFS autopilot functions
   function fixAngle360(angle)
   {  while (angle < 0) angle += 360;
      while (angle >= 360) angle -= 360;
      return angle;
   }
   function clamp(val, min, max) { return typeof val === 'number' && typeof min === 'number' && typeof max === 'number' ? val < max ? val > min ? val : min : max : NaN; }
   var decimalsOnly = /^[+-]?\d+\.?\d*$/;
   var wholeNumbersOnly = /^[+-]?\d+$/;
   var enabled =
     { heading: false
     , altitude: false
     , speed: false };
   
   var altitudeChanged = false;
   var metersToFeet = 1 / 0.3048;
   
   // replacing autopilot completely gives more flexibility to us, with no loss of backward compatibility
   var autopilot = controls.autopilot =
      { setHeading: function (heading)
         {  var newHdg = fixAngle360(parseInt(heading, 10));
            $('.gefs-autopilot-heading').val(isFinite(newHdg) ? autopilot.heading = newHdg : autopilot.heading); // deliberate assignment
         }
      , setAltitude: function (altitude)
         {  var newAlt = parseInt(altitude, 10);
            $('.gefs-autopilot-altitude').val(isFinite(newAlt) ? autopilot.altitude = newAlt : autopilot.altitude); // deliberate assignment
         }
      , setKias: function (kias)
         {  var newSpd = parseInt(kias, 10);
            $('.gefs-autopilot-kias').val(isFinite(newSpd) ? autopilot.kias = newSpd : autopilot.kias); // deliberate assignment
         }
      , setVs: function (vs)
         {  var newVs = parseInt(vs, 10);
            // check new speed is not NaN
            $('#Qantas94Heavy-gc-vs').val(autopilot.climbrate = isFinite(newVs) ? newVs : vs === ''  ? '' : autopilot.climbrate); // deliberate assignment
         }
      , update: (function ()
         {  var abs = Math.abs;
            var max = Math.max;
            var min = Math.min;
            var arctan = Math.atan;
            
           var lastAileronPosition, lastElevatorPosition;
            
           return function (dt)
            {  var values = ges.aircraft.animationValue;
               var speedRatio = clamp(values.kias / 100, 1, 5); // calculate relative speed of aircraft as correction factor
            
              // ensure autopilot not used if we're below 500ft AGL - turn off AP if that's the case and other extreme flight conditions
               if (!DEBUG)
               if (values.altitude - max(ges.groundElevation * metersToFeet, -1000) < 500 ||
                   ui.hud.stallAlarmOn || abs(values.aroll) > 45 || values.atilt > 20 || values.atilt < -35)
               {  autopilot.turnOff();
                  return;
               }
               function updateAltitude()
               {  // elevator setting, altitude/vertical speed mode
                  
                 if (altitudeChanged !== enabled.altitude)
                  {  // make sure autopilot starts in trim
                     controls.elevatorTrim = clamp(controls.pitch, controls.elevatorTrimMin, controls.elevatorTrimMax);
                     controls.rawPitch = 0;
                     altitudeChanged = true;
                     var startTime = new Date().getTime();
                     var originalTrim = controls.elevatorTrim;
                     var resetTrim = setInterval(function ()
                     {  var timeSince = new Date().getTime() - startTime;
                        if (timeSince >= 5000)
                        {  clearInterval(resetTrim);
                           controls.elevatorTrim = 0;
                           return;
                        }
                        controls.elevatorTrim = originalTrim * (1 - timeSince / 5000);
                     }, 4);
                  }
                  
                  var deltaAltitude = autopilot.altitude - values.altitude;
                  var maxClimbRate = clamp(speedRatio * autopilot.commonClimbrate, 0, autopilot.maxClimbrate);
                  var maxDescentRate = clamp(speedRatio * autopilot.commonDescentrate, autopilot.maxDescentrate, 0);
                  
                  var vsInput = $('#Qantas94Heavy-gc-vs');
                  var vsValue = vsInput.val();
                  var targetClimbrate;
                  // check if vertical speed manually set
                  if (typeof autopilot.climbrate === 'number' && isFinite(autopilot.climbrate))
                  {  if (autopilot.climbrate === 0)
                     {  //force vertical speed to be 0
                        targetClimbrate = 0;
                        if (vsValue !== '0' && notFocused) vsInput.val('0');
                     } else if (autopilot.climbrate < 0 ? deltaAltitude < -200 : deltaAltitude > 200) // check that vertical speed is in right direction to altitude
                     {  targetClimbrate = autopilot.climbrate;
                        if (vsValue !== targetClimbrate + '' && notFocused) vsInput.val(targetClimbrate + '');
                     } else // not valid for conditions
                     {  // automatically calculate vertical speed
                        targetClimbrate = clamp(deltaAltitude * 2.5, maxDescentRate, maxClimbRate);
                        if (vsValue !== '' && notFocused) vsInput.val('');
                     }
                  } else 
                  {  // automatically calculate vertical speed
                     targetClimbrate = clamp(deltaAltitude * 2.5, maxDescentRate, maxClimbRate);
                     if (vsValue !== '' && notFocused) vsInput.val('');
                  }
               
                  //autopilot.climbPID.set(targetClimbrate);
                  var aTargetTilt = autopilot.climbPID.compute(values.climbrate, dt, targetClimbrate);
                  aTargetTilt = clamp(aTargetTilt, autopilot.minPitchAngle, autopilot.maxPitchAngle);
                  // autopilot.pitchPID.set(aTargetTilt);
                  controls.rawPitch = exponentialSmoothing('apPitch', autopilot.pitchPID.compute(-values.atilt, dt, aTargetTilt) / speedRatio, 0.9);
                  
                 /*if (typeof lastElevatorPosition !== 'number') lastElevatorPosition = controls.rawPitch;
                  var travelPerSecond = (controls.rawPitch - lastElevatorPosition) / dt;
                  if (travelPerSecond > 0.8) controls.rawPitch = lastElevatorPosition + 0.8 * dt;
                  if (travelPerSecond < -0.8) controls.rawPitch = lastElevatorPosition - 0.8 * dt;*/
                  
                  ges.debug.watch('targetClimbrate', targetClimbrate);
                  ges.debug.watch('aTargetTilt', aTargetTilt);
               }
               function updateHeading()
               {  // set aileron/rudder, heading mode
                  var deltaHeading = fixAngle(values.heading - autopilot.heading); // difference in target/current headings, bound to range -180 to 180 degrees
                  
                  var maxBankAngle = min(arctan(0.0027467328927254283 * values.ktas) * radToDegrees, autopilot.maxBankAngle); // double standard rate turn or max bank angle, whichever is less
                  var targetBankAngle = clamp(deltaHeading, -maxBankAngle, maxBankAngle); // bank angle equal to difference in headings, up to limit (10° heading = 10° bank)
                  controls.yaw = exponentialSmoothing('apYaw', values.roll / 2, 0.1); // FIXME: incorrect usage of target bank angle for rudder deflection
                  // autopilot.rollPID.set(targetBankAngle);
                  controls.roll = exponentialSmoothing('apRoll', -autopilot.rollPID.compute(values.aroll, dt, targetBankAngle) / speedRatio, 0.9);
                  
                  // 100% haxoring
                  if (ges.aircraft.name === 'a380') controls.roll *= 2.5;
                  
                 /*if (typeof lastAileronPosition !== 'number') lastAileronPosition = controls.roll;
                  var travelPerSecond = (controls.roll - lastAileronPosition) / dt;
                  if (travelPerSecond > 1.2) controls.roll = lastAileronPosition + 1.2 * dt;
                  if (travelPerSecond < -1.2) controls.roll = lastAileronPosition - 1.2 * dt;*/
               }
               function updateThrottle()
               {  // autopilot.throttlePID.set(autopilot.kias);
                  controls.throttle = clamp(exponentialSmoothing('apThrottle', autopilot.throttlePID.compute(values.kias, dt, autopilot.kias), 0.9), 0, 1);
                  ges.debug.watch('throttle', controls.throttle);
               }
               if (enabled.heading) updateHeading();
               if (enabled.altitude) updateAltitude();
               if (enabled.speed) updateThrottle();
            };
         })()
      , turnOn: function ()
         {  if (!ges.aircraft.setup.autopilot) return;
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
            if (!enabled.heading && (mode === 'GC mode (lat/long)' || mode === 'Great Circle (ICAO)'))
            {  enabled.heading = true;
               $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
            }
         }
      , turnOff: function ()
         {  ui.hud.autopilotIndicator(autopilot.on = false); // deliberate assignment
            $('.gefs-autopilot-toggle')
               .first()
               .text('Disengaged')
               .removeClass('btn-warning');
            enabled =
               { heading: false
               , altitude: false
               , speed: false };
            altitudeChanged = false;
            $('#Qantas94Heavy-ap-alt, #Qantas94Heavy-ap-hdg, #Qantas94Heavy-ap-spd').removeClass('btn-warning');
            audio.playSoundLoop('apDisconnect', 1);
         }
      , toggle: function () { autopilot[autopilot.on ? 'turnOff' : 'turnOn'](); }
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
      , climbPID: new PID(0.01, 0.0005, 0.001, -20, 10)
      , pitchPID: new PID(0.02, 0.01, 0.001, -1, 1)
      , rollPID: new PID(0.02, 0, 0.01, -1, 1)
      , throttlePID: new PID(0.01, 0.005, 0.01, 0, 1)
      };
   
   var apDisconnectSound = 
      { id: 'apDisconnect'
      , file: 'http://dl.dropbox.com/s/uyqz78wget1tetj/test3.mp3' };

   V3.duplicate = V3.dup;
   Aircraft.prototype.load = function (aircraftName, coordinates, justReload)
   {  var href = PAGE_PATH
             + (aircraftName.indexOf('/') !== -1
             ? aircraftName + '/aircraft.kml?killcache=' 
             : 'models/aircrafts/' + aircraftName + '/' +  aircraftName + (ges.PRODUCTION
                                                         ? '.kmz?killcache=' 
                                                         : '-kmz/aircraft.kml?killcache=')
             ) + ges.killCache;
      this._cockpitLoaded = false;
      google.earth.fetchKml(ge, href, function (kmlObject)
      {  // is setTimeout necessary? (fetchKml is already async)
         //setTimeout(function ()
         //{ if (kmlObject)
            if (kmlObject)
            {  var aircraft = ges.aircraft;
               try { aircraft.setup = eval(kmlObject.getDescription())[0]; }
               catch (e)
               {  ges.debug.alert('Error loading aircraft: ' + e);
                  ges.undoPause();
               }
               
               aircraft.controllers =
                  { pitch:
                     { recenter: false
                     , sensitivity: 1
                     , ratio: 1 }
                  , roll:
                     { recenter: true
                     , sensitivity: 1
                     , ratio: 1 }
                  , yaw:
                     { recenter: true
                     , sensitivity: 1
                     , ratio: 1 }
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
               for (var i in aircraft.setup.cameras)
               {  var definition = aircraft.setup.cameras[i];
                  definition.distance *= aircraft.setup.scale;
                  if (definition.position) definition.position = V3.scale(definition.position, aircraft.setup.scale);
               }
               aircraft.placemarks = {};
               aircraft.kmlObjects = [];
               var root =
                  { name: 'root'
                  , position: aircraft.setup.com || [0, 0, 0] };
               aircraft.object3d = new Object3D(root);
               aircraft.addParts(aircraft.setup.parts, kmlObject, aircraft.setup.scale);
               aircraft.boundingSphereRadius = 0;
               for (var i = 0, l = aircraft.collisionPoints.length; i < l; i++) aircraft.boundingSphereRadius = Math.max(aircraft.boundingSphereRadius, V3.length(aircraft.collisionPoints[i]));
               aircraft.boundingSphereRadius *= 1.5;
               for (var i in aircraft.setup.contactProperties)
               {  var contact = aircraft.setup.contactProperties[i];
                  if (!contact.lockSpeed) contact.lockSpeed = 0.01;
               }
               aircraft.object3d.render(
                  { llaCoordinates: aircraft.llaLocation
                  , collisions: true }
               );
               for (var i = aircraft.setup.parts.length; i--;)
               {  var part = aircraft.setup.parts[i];
                  if (part.suspension)
                  {  part.suspension.origin = [part.collisionPoints[0][0], part.collisionPoints[0][1], 0];
                     var suspensionHeight = -part.collisionPoints[0][2];
                     part.suspension.restLength = suspensionHeight;
                     if (part.suspension.motion === 'rotation')
                     {  var rotationRadius = V3.length(part.collisionPoints[0]);
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
               if (typeof aircraft.setup.airbrakesTravelTime === 'number') aircraft.setup.airbrakesTravelTime = 1; // adjust unrealistic spoiler extension time
               aircraft.setup.brakeDamping = 5;
               if (!aircraft.setup.autopilot) autopilot.turnOff();
               
               // set thrust for each engine to be read-only properties, if supported
               var READ_ONLY = { writable: false };
               if (Object.defineProperties) for (var i = 0, engines = aircraft.engines, l = engines.length; i < l; ++i) Object.defineProperties(
                  engines[i],
                  { thrust: READ_ONLY
                  , reverseThrust: READ_ONLY
                  , afterBurnerThrust: READ_ONLY }
               );
               
               ges.flyTo(coordinates, !!justReload);
            } else
            {  alert('Error loading aircraft file');
               ges.undoPause();
            }
         //});
      });
   };

   // create global great circle public interface
   (function gcInit()
   {  // make sure ges.aircraft exists - if not try again later
      if (!(typeof ges === 'object' && ges.aircraft && ges.aircraft.setup))
      {  setTimeout(gcInit, 100);
         return;
      }
      var timer, lat, lon;
      var status = 'off';
      var aircraft = ges.aircraft;
      var atan2 = Math.atan2;
      var sin = Math.sin;
      var cos = Math.cos;
      
      function isNumber(arg1) // arg1, [arg2, ...argN]
      {  var l = arguments.length;
         if (!l) return false; // if no arguments given, return false
         for (var i = 0; i < l; ++i) if (typeof arguments[i] !== 'number') return false;
         return true;
      }
      
      function setHeading() { if (isNumber(lat, lon)) autopilot.setHeading(Math.round(gc.getHeading(lat, lon))); }
      
      var setTimer;
      // while we're at it, let's add a flight spoiler mode
      controls.setters.setAirbrakes.set = function ()
      {  var airbrakes = controls.airbrakes;
         var ground = ges.aircraft.groundContact;
         if (airbrakes.target === 0)
         {  airbrakes.target = ground ? 1 : 0.5;
            if (!setTimer) setTimer = setInterval(function ()
            {  if (ges.aircraft.groundContact !== ground)
               {  airbrakes.target = ges.aircraft.groundContact ? 1 : 0.5;
                  controls.setPartAnimationDelta(airbrakes);
                  ground = ges.aircraft.groundContact;
               }
            }, 50);
         } else
         {  airbrakes.target = 0;
            clearInterval(setTimer);
            setTimer = null;
         }
         controls.setPartAnimationDelta(airbrakes);
      };
      
      // create public interface for great circle fuction
      window.gc =
         { on: function ()
            {  clearInterval(timer);
               timer = setInterval(setHeading, 1000);
               status = 'on';
            }
         , off: function ()
            {  clearInterval(timer);
               timer = null;
               status = 'off';
            }
         , getLatitude: function () { return +lat; }
         , getLongitude: function () { return +lon; }
         , getHeading: function ()
            {  var coords = aircraft.getCurrentCoordinates();
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
         , getStatus: function () { return status; }       
         , setLatitude: function (newLat, calledByInput)
            {  if (decimalsOnly.test(newLat)) lat = clamp(parseFloat(newLat), -90, 90);
               if (calledByInput) $('#Qantas94Heavy-gc-lat').val(lat + '');
            }
         , setLongitude: function (newLon, calledByInput)
            {  if (decimalsOnly.test(newLon)) lon = clamp(parseFloat(newLon), -180, 180);
               if (calledByInput) $('#Qantas94Heavy-gc-lon').val(lon + '');
            }
         };
   })();
   
   // database of ICAO airports, courtesy OurAirports
   /*jshint -W008*/
   var icaos = 
   /*jshint +W008*/


   /* MAKE THE USER INTERFACE */
   
   // set ` key for autopilot disconnect, like the red sidestick button
   $(document).keydown(function (e) { if (e.which === 192) autopilot.disconnect(); });
   
   var mode = 'Heading mode'; // allow referencing current mode when toggling
   
   var hdgDiv = $('<div>') // recreating heading div with HTML5 number type
      .addClass('input-prepend input-append')
      .append(
         $('<span>')
            .attr('id', 'Qantas94Heavy-ap-hdg')
            .addClass('add-on')
            .text('Hdg.')
            // deliberate assignment
            .click(function () { $(this)[(enabled.heading = autopilot.on ? !enabled.heading : false) ? 'addClass' : 'removeClass']('btn-warning'); }),
         $('<input>')
            .attr('type', 'number')
            .addClass('gefs-autopilot-heading')
            .width('146px')
            .change(function () { autopilot.setHeading(this.value); }),
         $('<span>')
            .addClass('add-on')
            .text('deg.')
      );
   
   // remove and replace heading div - jQuery older than 1.9 does not allow changing type of input
   $('.gefs-autopilot-heading')
      .parent()
      .after(hdgDiv)
      .remove();
      
   var spdDiv = $('<div>') // recreating speed div with HTML5 number type
      .addClass('input-prepend input-append')
      .append(
         $('<span>')
            .attr('id', 'Qantas94Heavy-ap-spd')
            .addClass('add-on')
            .text('Spd.')
            // deliberate assignment
            .click(function () { $(this)[(enabled.speed = autopilot.on ? !enabled.speed : false) ? 'addClass' : 'removeClass']('btn-warning'); }),
         $('<input>')
            .attr('type', 'number')
            .addClass('gefs-autopilot-kias')
            .width('146px')
            .change(function () { autopilot.setKias(this.value); }),
         $('<span>')
            .addClass('add-on')
            .text('kts.')
      );
      
   $('.gefs-autopilot-kias')
      .parent()
      .after(spdDiv)
      .remove();
      
   var notFocused = true; // check for focus on vertical speed input
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
                  // deliberate assignment
                  .click(function ()
                  {  $(this)[(enabled.altitude = autopilot.on ? !enabled.altitude : false) ? 'addClass' : 'removeClass']('btn-warning');
                     altitudeChanged = false;
                  }),
               $('<input>')
                  .attr('type', 'number')
                  .addClass('gefs-autopilot-altitude Qantas94Heavy-ap-input')
                  .css('width', '66px')
                  .change(function () { autopilot.setAltitude(this.value); })
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
                  .attr('id', 'Qantas94Heavy-gc-vs')
                  .addClass('Qantas94Heavy-ap-input')
                  .css('width', '54px')
                  .change(function () { autopilot.setVs(this.value); })
                  .focus(function () { notFocused = false; })
                  .blur(function () { notFocused = true; })
            )
      )
      .css('display', 'inline-block')
      .css('margin-bottom', '-1px');

   // do the same with altitude div
   $('.gefs-autopilot-altitude')
      .parent()
      .after(altDiv)
      .remove();

   // reference autopilot toggle button so that we can move it to outer div
   var onOff = $('.gefs-autopilot-toggle')
      .css('margin', '0 5% 5px')
      .width('40%');

   // create heading/great circle mode toggle button
   var gcOrHdg = $('<button>')
      .addClass('btn btn-mini gefs-autopilot-toggle')
      .css('margin', '0 5% 5px')
      .width('40%')
      .text('Heading mode')
      .click(function () // TODO: refactor this, too ugly
      {  if (mode === 'Heading mode')
         {  hdgDiv.hide();
            gcDiv.css('display', 'inline-block');
            icaoDiv.hide();
            gcOrHdg.text(mode = 'GC mode (lat/long)'); // deliberate assignment
            gc.on();
         } else if (mode === 'GC mode (lat/long)')
         {  hdgDiv.hide();
            gcDiv.hide();
            icaoDiv.css('display', 'block');
            gcOrHdg.text(mode = 'Great Circle (ICAO)'); // deliberate assignment
         } else
         {  hdgDiv.css('display', 'block');
            gcDiv.hide();
            icaoDiv.hide();
            gcOrHdg.text(mode = 'Heading mode'); // deliberate assignment
            gc.off();
         }
      });
      
   // create container to store both buttons and append them to it
   var btnDiv = $('<div>')
      .width('100%')
      .css('display', 'inline-block')
      .append(onOff, gcOrHdg)
      .insertAfter($('.gefs-autopilot > h6'));

   // latitude div container
   var latDiv = $('<div>')
      .addClass('input-prepend')
      .css('margin', '0 5px 0 0')
      .css('float', 'left')
      .append(
         $('<span>')
            .addClass('add-on')
            .text('Lat.'),
         $('<input>')
            .attr('id', 'Qantas94Heavy-gc-lat')
            .attr('type', 'text')
            .addClass('Qantas94Heavy-ap-input')
            .css('width', '56px')
            .change(function ()
            {  if (!enabled.heading)
               {  enabled.heading = true;
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
         $('<span>')
            .addClass('add-on')
            .text('Lon.'),
         $('<input>')
            .attr('id', 'Qantas94Heavy-gc-lon')
            .attr('type', 'text')
            .addClass('Qantas94Heavy-ap-input')
            .css('width', '65px')
            .change(function ()
            {  if (!enabled.heading)
               {  enabled.heading = true;
                  $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
               }
               gc.setLongitude(this.value, true);
            })
      );
   
   // put everything together
   // create container to store lat and lon inputs and append them
   var gcDiv = $('<div>')
      .css('margin-bottom', '-1px')
      .append(latDiv, lonDiv)
      .insertAfter(hdgDiv)
      .hide();
      
      
   // allow ICAO airport code input
   function stopPropagation(event) { event.stopPropagation(); }
   var icaoDiv = $('<div>')
      .addClass('input-prepend input-append')
      .append(
         $('<span>')
            .addClass('add-on')
            .text('Arpt.'),
         $('<input>')
            .attr('id', 'Qantas94Heavy-gc-icao')
            .attr('type', 'text')
            .addClass('Qantas94Heavy-ap-input')
            .css('width', '146px')
            .keydown(stopPropagation)
            .keyup(stopPropagation)
            .change(function ()
            {  if (icaos === null)
               {  alert('ICAO codes loading, please wait...');
                  return;
               }

               var $this = $(this);
               var inputVal = $this.val();
               var code = inputVal.trim().toUpperCase(); // ICAO chracters are uppercase      
               if (icaos[code])
               {  if (!enabled.heading)
                  {  enabled.heading = true;
                     $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
                  }
                  gc.setLatitude(icaos[code][0], true);
                  gc.setLongitude(icaos[code][1], true);
                  if (inputVal !== code) $this.val(code);
               } else
               {  alert('Sorry, code "' + inputVal + '" is an invalid or unrecognised ICAO airport code.');
                  $this.val('');
               }
            }),
         $('<span>')
            .addClass('add-on')
            .text('ICAO')
      )
      .insertAfter(hdgDiv)
      .hide();
})(1e999, +{});