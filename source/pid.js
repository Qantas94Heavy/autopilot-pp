'use strict';

define(function () {
  var defaults =
    { kp: 0
    , ti: 0
    , td: 0
    , min: -Infinity
    , max: Infinity
    , errorSum: 0
    , lastInput: 0
    };
    
  var pidProperties = Object.keys(defaults);
  var hasOwnProperty = {}.hasOwnProperty;
    
  pidProperties.forEach(function (prop) {
    PID.prototype[prop] = defaults[prop];
  });
  
  /** 
   * Creates an object representing a proportional-integral-derivative (PID) controller.
   * @constructor
   */
  function PID(options) {
    if (options) pidProperties.forEach(function (prop) {
      if (hasOwnProperty.call(options, prop)) this[prop] = options[prop];
    }, this);
  }

  /**
   * Gets the value of the next PID output given an input, setpoint and time since last call.
   * @return {Number}
   */
  PID.prototype.compute = function (input, dt, setPoint, tracking) {
    var error = setPoint - input;
    this.errorSum += error * dt;
    
    var kp = this.kp;
    var ti = this.ti;
    var td = this.td;

    // use derivative on measurement instead of derivative on error to prevent derivative kick
    // see http://brettbeauregard.com/blog/2011/04/improving-the-beginner%E2%80%99s-pid-derivative-kick
    var dInput = (this.lastInput - input) / dt;
    this.lastInput = input;

    var output = kp * (error + ti * this.errorSum + td * dInput);

    // correct integrator windup
    function diff(arg) {
      return (arg - output) / (kp * ti);
    }

    if (ti) {
      // TODO: fix up tracking mode
      if (tracking) this.errorSum += diff(setPoint); 
      else if (output > this.max) this.errorSum += diff(this.max);
      else if (output < this.min) this.errorSum += diff(this.min);

      return kp * (error + ti * this.errorSum + td * dInput);
    }

    return output;
  };

  PID.prototype.reset = function () {
    this.errorSum = 0;
    this.lastInput = 0;
  };
  
  
  if (DEBUG) window.pid = new PID;
  
  return PID;
});