'use strict';

define(['pid'], function (PID) {
  // TODO: move PID gains to aircraft configuration files
  var pidSettings =
    { climb: new PID(
      { kp: 0.01
      , ti: 0.1
      , td: 0.005
      , min: -10
      , max: 10
      })
    , pitch: new PID(
      { kp: 0.02
      , ti: 0.5
      , td: 0.01
      , min: -1
      , max: 1
      })
    , roll: new PID(
      { kp: 0.02
      , ti: 0.01
      , td: 0.01
      , min: -1
      , max: 1
      })
    , throttle: new PID(
      { kp: 0.015
      , ti: 0.4
      , td: 0.1
      , min: 0
      , max: 1
      })
    };
    
  return pidSettings;
});
