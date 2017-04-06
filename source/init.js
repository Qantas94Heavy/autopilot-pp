/*!
 * @license Copyright (c) Karl Cheng 2013-16
 * Licensed under the GNU General Public Licence, version 3 or later.
 * See the LICENSE.md file for details.
 */
'use strict';

// UglifyJS makes it slightly annoying to make a debug flag.
if (typeof DEBUG === 'undefined') window.DEBUG = true;

// RequireJS caches JS files, which is annoying when developing.
if (DEBUG) require.config({ urlArgs: "_=" + Date.now(), waitSeconds: 15 });

// Make sure code is run after GEFS is ready.
require([ 'ui/main' ], function (initUI) {
  // Check if geofs.init has already been called.
  if (window.geofs && geofs.canvas) {
    initUI();
    return;
  }

  var timer = setInterval(function () {
    if (!window.geofs || !geofs.init) return;
    clearInterval(timer);

    // The original geofs.init function might have already run between two checks.
    if (geofs.canvas) initUI();
    else {
      var oldInit = geofs.init;

      geofs.init = function () {
        oldInit();
        initUI();
      };
    }
  }, 16);
});
