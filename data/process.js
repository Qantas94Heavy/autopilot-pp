'use strict';

const fs = require('fs');

let a = fs.readFileSync('earth_fix (1).dat', 'utf8');
a = a.split('\n').slice(3, -2);
console.log(a[0]);
a = a.map(x => x.match(/(\-?\d+\.\d+) +(\-?\d+\.\d+) +(\w+) .*/).slice(1));

const fixes = {};

for (const fix of a) {
  const name = fix[2];
  if (!fixes[name]) fixes[name] = [];
  fixes[name].push([ +fix[0], +fix[1] ]);
}

let results = JSON.stringify(fixes, null, 2);
results = results.replace(/\[\n +/g, '[ ');
results = results.replace(/(\d),\n +/g, '$1, ');
results = results.replace(/\n +(\[|\])/g, ' $1');

fs.writeFileSync('results', results);
