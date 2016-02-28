// Copyright (c) Karl Cheng 2014-16
// Licensed under the GNU General Public Licence, version 3 or later.
// See the LICENSE.md file for details.

// NOTE: since we are only releasing this plugin for Chrome and Firefox, ES3 compatibility will be no longer be maintained.
'use strict';

// UglifyJS makes it slightly annoying to make a debug flag
if (typeof DEBUG === 'undefined') window.DEBUG = true;

// RequireJS caches JS files, which is annoying when developing
if (DEBUG) require.config({ urlArgs: "_=" + Date.now() });

// make sure code is run after GEFS is ready
(function () {
  // check if gefs.init has already been called
  if (window.gefs && gefs.map3d) require(['ui/main']);
  else {
    var oldInit = gefs.init;
    var timer = setInterval(function () {
      if (window.gefs && gefs.init) {
        clearInterval(timer);
        gefs.init = function () {
          oldInit();
          require(['ui/main']);
        };
      }
    }, 16);
  }
})();
