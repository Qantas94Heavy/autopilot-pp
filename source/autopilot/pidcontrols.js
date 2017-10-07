'use strict';

// IDEA: move PID gains to aircraft configuration files
define([ 'pid' ], function (PID) {
  var pidSettings =
    { climb: new PID(
      { kp: 0.01
      , ti: 10
      , td: 0.005
      , min: -10
      , max: 10
      })
    , pitch: new PID(
      { kp: 0.02
      , ti: 2
      , td: 0.01
        // Allow for some elevator authority even when divided by speedRatio.
      , min: -3
      , max: 3
      })
    , roll: new PID(
      { kp: 0.02
      , ti: 100
      , td: 0.01
      , min: -1
      , max: 1
      })
    , throttle: new PID(
      { kp: 0.015
      , ti: 2.5
      , td: 0.1
      , min: 0
      , max: 1
      })
    };

  return pidSettings;
});
