'use strict';
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
      if (lapseRate === 0) newPressure = pressure * exp(-gravity * airMass * (min(altitude, nextLayerHeight) - layerHeight) / molar / baseTemperature);
      else newPressure = pressure * pow(baseTemperature / newTemperature, gravity * airMass / molar / lapseRate);
    
      if (nextLayerHeight >= altitude && !Array.isArray(pressure)) return [ newPressure, newTemperature ];
      return pressure;
    }, 101325);
  }

  /**
   * Converts KTAS to KCAS. Has two signatures:
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

/* usage:

instruments.list.airspeedJet.overlay.children[0].definition.animations[0].value = 'kcas';
setInterval(function () {
  var animationValue = ges.aircraft.animationValue;
  animationValue.kcas = airspeedConversions.tasToCas(animationValue.ktas, animationValue.altitude * 0.3048);
}, 16);

*/