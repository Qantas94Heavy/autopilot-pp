'use strict';

define(function () {
  // NOTE: unless otherwise stated, all temperatures are in Kelvin.

  // Mohr, P. J., Taylor, B. N. & Newell, D. B. (2012). CODATA recommended values of the
  // fundamental physical constants: 2010.
  var molar = 8.3144621;
  var avogardo = 6.02214129e23;
  var boltzmann = 1.3806487924497035e-23;

  // International Committee of Weights and Measures. (1901).
  // Techically a bit high, but we'll use it anyway (meant to be 45 but actually ~45.523 latitude).
  var gravity = 9.80665;

  // Gatley, D. P., Herrmann, S. & Kretzschmar, H.-J. (2008). A Twenty-First Century Molar Mass
  // for Dry Air.
  // kilograms per mole
  // var airMass = 28.965369-3;

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

  /**
   * @param {Number} temperature
   * @returns {Number} Speed of sound in metres per second.
   */
  function speedOfSound(temperature) {
    return Math.sqrt(gamma * airGasConstant * temperature);
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

  function tasToMach(ktas, temperature) {
    return ktas * knotsToMs / speedOfSound(temperature);
  }

  function casToMach(kcas, pressure, temperature) {
    if (arguments.length === 2) {
      var altitude = pressure;
      var condition = standardConditions(altitude);
      pressure = condition[0];
      temperature = condition[1];
    }

    return tasToMach(casToTas(kcas, pressure, temperature), temperature);
  }

  function machToCas(mach, pressure, temperature) {
    // check if second argument is altitude (instead of pressure)
    if (arguments.length === 2) {
      var altitude = pressure;
      var condition = standardConditions(altitude);
      pressure = condition[0];
      temperature = condition[1];
    }

    return tasToCas(mach * msToKnots * speedOfSound(temperature), pressure, temperature);
  }


  function tasToEas(ktas, density) {
    return ktas * Math.sqrt(density / densitySL);
  }

  function easToTas(keas, density) {
    return keas * Math.sqrt(densitySL / density);
  }

  // TAS = EAS * mach / (machSL * Math.sqrt(pressure / pressureSL));

  /** @param {Number} altitude - In metres. */
  // National Aeronautics and Space Administration. (1976). U.S. Standard Atmosphere.
  // TEST: PASS
  function standardConditions(altitude) {
    var exp = Math.exp;
    var min = Math.min;
    var pow = Math.pow;

    // This uses geopotential height -- not sure whether we should be using geometric or
    // geopotential height.
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

    var pressure = 101325;
    var temperature = 288.15;

    layers.some(function (currentLayer, i) {
      var baseTemperature = currentLayer[0];
      var layerHeight = currentLayer[1];
      var nextLayerHeight = layers[min(i + 1, layers.length - 1)][1];
      var lapseRate = currentLayer[2];
      var heightDifference = min(altitude, nextLayerHeight) - layerHeight;
      temperature = baseTemperature + heightDifference * lapseRate;

      if (lapseRate === 0) pressure *= exp(
        -gravity * airMass * heightDifference / molar / baseTemperature
      );
      else pressure *= pow(
        baseTemperature / temperature,
        gravity * airMass / molar / lapseRate
      );

      if (nextLayerHeight >= altitude) return true;
    });

    return [ pressure, temperature ];
  }

  function tasToCas(ktas, pressure, temperature) {
    if (arguments.length === 2) {
      // second argument is actually altitude, not pressure
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
    // sqrt(pow(x, 7)) or pow(x, 7 / 2)?
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
    , tasToMach: tasToMach
    , airDensity: airDensity
    , standardConditions: standardConditions
    , casToMach: casToMach
    , machToCas: machToCas
    , tasToCas: tasToCas
    , casToTas: casToTas
    , tasToEas: tasToEas
    , easToTas: easToTas
    , casToEas: casToEas
    , easToCas: easToCas
    };

  return airspeed;
});
