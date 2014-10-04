// Copyright (c) Karl Cheng 2014
// Licensed under the GNU General Public Licence, version 3 or later.
// See the LICENCE.md file for details.

// NOTE: since we are only releasing this plugin for Chrome and Firefox, ES3 compatibility will be no longer be maintained.
'use strict';

// UglifyJS makes it slightly annoying to make a debug flag
if (typeof DEBUG === 'undefined') window.DEBUG = true;

// RequireJS caches JS files, which is annoying when developing
if (DEBUG) require.config({ urlArgs: "_=" + Date.now() });

// make sure code is run after GEFS is ready
(function () {
  // check if ges.init has already been called
  if (window.ges && ges.map3d) require(['ui/main']);
  else {
    var oldInit = ges.init;
    var timer = setInterval(function () {
      if (window.ges && ges.init) {
        clearInterval(timer);
        ges.init = function () {
          oldInit();
          require(['ui/main']);
        };
      }
    }, 16);
  }
})();
