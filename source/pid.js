'use strict';

define(function () {
  var defaults =
    { kp: 0
    , ti: Infinity
    , td: 0
    , min: -Infinity
    , max: Infinity
    };

  var pidProperties = Object.keys(defaults);

  pidProperties.forEach(function (prop) {
    PID.prototype[prop] = defaults[prop];
  });

  /**
   * Creates an object representing a proportional-integral-derivative (PID) controller.
   * @constructor
   */
  function PID(options) {
    if (options) {
      pidProperties.forEach(function (prop) {
        this[prop] = options[prop] === undefined ? defaults[prop] : options[prop];
      }, this);
    } else {
      pidProperties.forEach(function (prop) {
        this[prop] = defaults[prop];
      }, this);
    }

    this.errorSum = 0;
    this.lastInput = undefined;
  }

  /**
   * Gets the value of the next PID output given an input, setpoint and time since last call.
   * @return {Number}
   */
  PID.prototype.compute = function (input, dt, setPoint) {
    var kp = this.kp;
    var ti = this.ti;
    var td = this.td;

    var error = setPoint - input;
    // Store product of K_i (= K_p / T_i) and integral of error over time dt.
    // http://brettbeauregard.com/blog/2011/04/improving-the-beginner%e2%80%99s-pid-tuning-changes
    this.errorSum += error * dt / ti;

    // Use derivative on measurement instead of derivative on error to prevent derivative kick.
    // http://brettbeauregard.com/blog/2011/04/improving-the-beginner%E2%80%99s-pid-derivative-kick
    var dInput = this.lastInput === undefined ? 0 : (this.lastInput - input) / dt;
    this.lastInput = input;

    // Calculate output using the PID "standard form" formula.
    var output = kp * (error + this.errorSum + td * dInput);

    // Use tracking anti-windup scheme to mitigate the effects of integrator windup.
    if (ti) {
      // Change error sum to be at maxmimum or minimum of output.
      if (output > this.max) {
        this.errorSum += (this.max - output) / kp;
        return this.max;
      }

      if (output < this.min) {
        this.errorSum += (this.min - output) / kp;
        return this.min;
      }
    }

    return output;
  };

  PID.prototype.init = function (currOutput) {
    this.errorSum = currOutput / this.kp;
    this.lastInput = undefined;
  };

  return PID;
});
