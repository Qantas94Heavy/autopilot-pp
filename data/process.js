'use strict';

var csv = require('csv-parser');
var fs = require('fs');

var processed = {};
 
fs.createReadStream('airports.csv')
  .pipe(csv())
  .on('data', function (airport) {
    processed[airport.ident] = [ +airport.latitude_deg, +airport.longitude_deg ];
  })
  .on('end', function () {
    var a = JSON.stringify(processed);
    a = a.replace(/\],"/g, ' ]\n, "').replace(/":\[/g, '": [ ').replace(/,(?=[-\d])/g, ', ');
    fs.writeFileSync('test.json', a);
  });
