'use strict';

define([ 'knockout', 'greatcircle', 'autopilot', 'util', 'getwaypoint' ],
       function (ko, gc, ap, util, getWaypoint) {
  /* CODE FOR VALIDATION OF INPUTS */
  function validateAltitude(val) {
    return parseInt(val);
  }

  function validateHeading(val) {
    return util.fixAngle360(parseInt(val));
  }

  function validateLat(val) {
    return util.clamp(parseFloat(val), -90, 90);
  }

  function validateLon(val) {
    return util.clamp(parseFloat(val), -180, 180);
  }

  function apValidate(target, fn) {
    return function (val) {
      var current = target();
      var newValue = fn(val);

      if (newValue !== current && !isNaN(newValue)) target(newValue);
      // change value if actual value same
      else target.notifySubscribers(newValue);
    };
  }

  ko.extenders.apValidate = function (target, fn) {
    var result = ko.pureComputed({
      read: target,
      write: apValidate(target, fn)
    });

    return result;
  };

  var modeToText = [ 'Heading mode', 'Lat/lon mode', 'Waypoint mode' ];

  function AutopilotVM() {
    this.on = ap.on;
    this.currentMode = ap.currentMode;
    this.currentModeText = ko.pureComputed(function () {
      var index = ap.currentMode();
      return modeToText[index];
    });

    this.altitude = ap.modes.altitude.value.extend({ apValidate: validateAltitude });
    this.altitudeEnabled = ap.modes.altitude.enabled;

    function formatVs(value) {
      var str = Math.abs(value).toFixed(0);

      // Pad with zeroes.
      while (str.length < 4) str = '0' + str;

      // TODO: find a way of using "+" without triggering <input type="number"> validation.
      return (value < 0 ? '-' : '') + str;
    }

    this.vs = ko.pureComputed(
    { read: function () {
        if (ap.modes.vs.enabled()) return formatVs(ap.modes.vs.value());
        // Will be replaced by "-----" as this is the placeholder.
        return '';
      }
    , write: function (val) {
        var target = ap.modes.vs.value;
        var current = target();
        var newValue = parseInt(val);
        if (newValue !== newValue) newValue = undefined;

        if (newValue !== current) target(newValue);
        // change value if actual value same
        else target.notifySubscribers(newValue);
      }
    });

    this.heading = ko.pureComputed(
    { read: function () {
        var str = ap.modes.heading.value();
        // Pad the value to 3 digits.
        while (str.length < 3) str = '0' + str;
        return str;
      }
    , write: apValidate(ap.modes.heading.value, validateHeading)
    });

    this.headingEnabled = ap.modes.heading.enabled;

    this.speed = ko.pureComputed(
    { read: function () {
        var value = ap.modes.speed.value();
        return value.toFixed(ap.modes.speed.isMach() ? 2 : 0);
      }
    , write: function (val) {
        var target = ap.modes.speed.value;
        var current = target();
        var newValue = ap.modes.speed.isMach()
                     ? Math.round(parseFloat(val) + 'e2') / 100
                     : parseInt(val);

        if (newValue !== current && !isNaN(newValue)) target(newValue);
        // Ensure input field is changed if rounded value is same but input value different.
        else target.notifySubscribers(newValue);
      }
    });

    this.speedEnabled = ap.modes.speed.enabled;
    this.speedMode = ko.pureComputed(
    { read: function () {
        return ap.modes.speed.isMach() ? 'mach' : 'kias';
      }
    , write: function (val) {
        ap.modes.speed.isMach(val === 'mach');
      }
    });


    this.lat = gc.latitude.extend({ apValidate: validateLat });
    this.lon = gc.longitude.extend({ apValidate: validateLon });

    // REVIEW: should FMC be allowed to change the displayed ICAO value?
    var _waypoint = ko.observable();
    this.waypoint = ko.pureComputed(
    { read: _waypoint
    , write: function (inputVal) {
        // Wapoint names are uppercase, so make the input uppercase for consistency.
        var code = inputVal.trim().toUpperCase();

        var coord = getWaypoint(code);
        if (coord) {
          gc.latitude(coord[0]);
          gc.longitude(coord[1]);

          if (inputVal !== code) _waypoint(code);
          // Ensure input field is changed if code is same but input value is different.
          else _waypoint.notifySubscribers(code);
        } else {
          _waypoint('');
          // TODO: replace with proper UI warning
          alert('Code "' + inputVal + '" is an invalid or unrecognised ICAO airport code.');
        }
      }
    });

    this.toggle = ap.toggle;

    this.nextMode = function () {
      var mode = ap.currentMode();
      // Loop back around to first mode if currently on last mode.
      ap.currentMode(mode === modeToText.length - 1 ? 0 : mode + 1);
    };
  }

  // Handle MDL's annoying inputs that needs updating all the time.
  function updateMdlSwitch(element, _notUsed, bindings) {
    // jshint unused:false

    // Call these so the update is triggered when these bindings change.
    var isChecked = bindings.get('checked');
    var isEnabled = bindings.get('enable');
    if (isChecked) isChecked();
    if (isEnabled) isEnabled();

    // This has to be done after the bindings call as MaterialSwitch isn't
    // present yet when GeoFS is loaded.
    var materialSwitch = element.parentNode.MaterialSwitch;
    if (!materialSwitch) return;

    materialSwitch.checkDisabled();
    materialSwitch.checkToggleState();
  }

  function updateMdlRadio(element, _notUsed, bindings) {
    // jshint unused:false

    // Call these so the update is triggered when these bindings change.
    var isChecked = bindings.get('checked');
    var isEnabled = bindings.get('enable');
    if (isChecked) isChecked();
    if (isEnabled) isEnabled();

    // This has to be done after the bindings call as MaterialRadio isn't
    // present yet when GeoFS is loaded.
    var materialRadio = element.parentNode.MaterialRadio;
    if (!materialRadio) return;

    materialRadio.checkDisabled();
    materialRadio.checkToggleState();
  }

  // Create a custom bninding that handles this issue.
  ko.bindingHandlers.mdlSwitch = { update: updateMdlSwitch };
  ko.bindingHandlers.mdlRadio = { update: updateMdlRadio };

  return AutopilotVM;
});
