// Mohr, P. J., Taylor, B. N. & Newell, D. B. (2012). CODATA recommended values of the fundamental physical constants: 2010.
var molar = 8.3144621;
var avogardo = 6.02214129e23;
var boltzmann = 1.3806487924497035e-23;

// International Committee of Weights and Measures. (1901).
var gravity = 9.80665;

// Gatley, D. P., Herrmann, S. & Kretzschmar, H.-J. (2008). A Twenty-First Century Molar Mass for Dry Air.
// var airMass = 28.965369-3; // kilograms per mole

// ICAO Standard Atmosphere (assumption based on 1.225kg/m3 @ SL)
var airMass = 28.96491498930052e-3;

// assumes diatomic molecules (adiabatic index)
// relatively accurate, ranges from 1.3991 to 1.403 in real life
var gamma = 1.4;

// in floating point ...445 is actually closer than ...444
var knotsToMs = 0.5144444444444445; // 1852 / 3600

// 287.052874247044 gives incorrect result at sea level, but 287.0528742470439 works with floating point
var airGasConstant = 287.0528742470439; // molar / airMass

function speedOfSound(temperature)
{  if (!temperature || temperature < 0) return NaN;
   // gamma * airGasConstant * temperature
   return Math.sqrt(401.87402394586153 * temperature); // metres per second
}

var machSL = 340.2939905434711; // sqrt(115800)
var densitySL = 1.225;

// pascals, kelvin
function airDensity(pressure, temperature) { return pressure / temperature / airGasConstant; }

function mach(ktas, temperature) { return ktas * knotsToMs / speedOfSound(temperature + 273.15); }

function easFromTas(ktas, density) { return ktas * Math.sqrt(density / densitySL); }

//TAS = EAS * mach / (machSL * Math.sqrt(pressure / pressureSL));

// National Aeronautics and Space Administration. (1976). U.S. Standard Atmosphere.
function standardConditions(altitude)
{  //altitude *= 0.3048;
   
   // this uses geopotential height -- not sure whether
   // we should be using geometric or geopotential height
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
   
   return layers.reduce(function (pressure, currentLayer, i, arr)
   {  var baseTemperature = currentLayer[0];
      var layerHeight = currentLayer[1];
      var nextLayerHeight = arr[Math.min(i + 1, arr.length - 1)][1];
      var lapseRate = currentLayer[2];
      var newTemperature = baseTemperature + (Math.min(altitude, nextLayerHeight) - layerHeight) * lapseRate;
      var ret;
      if (lapseRate === 0) ret = pressure * Math.exp(-gravity * airMass * (Math.min(altitude, nextLayerHeight) - layerHeight) / molar / baseTemperature);
      else ret = pressure * Math.pow(baseTemperature / newTemperature, gravity * airMass / molar / lapseRate);
      
      if (nextLayerHeight >= altitude) ret = pressure.length ? pressure : [ ret, newTemperature ];
      return ret;
   }, 101325);
}

standardConditions(0500);