README
======

Autopilot++ v{0} for GEFS-Online

Installation Instructions
-------------------------

**Note: due to restrictions by Google, Windows users of Google Chrome will not
be able to install this extension.** Alternatives include:

 - Tampermonkey extension in Chrome to use the .user.js file
 - Firefox and Greasemonkey to use the .user.js file
 - Opera, which runs on the same base platform as Google Chrome
 - The development version of Chrome or Chromium (not recommended)

### Opera 15+:

1. Extract this zip file into an empty folder.
2. Open Opera, then click on the Opera menu button and click Extensions.
3. If applicable, uninstall any previous versions of the plugin.
4. Drag and drop "gefs_gc-setup.crx" into the Extensions page.
5. Click Install on the popup.

### Google Chrome/Chromium:

1. Extract this zip file into an empty folder.
2. Open Google Chrome/Chromium, then click on the menu button at the top right.
3. Hover over the Tools sub-menu, then click on Extensions.
4. If applicable, uninstall any previous versions of the plugin.
5. Drag and drop "gefs_gc-setup.crx" into the Extensions page.
6. Click "Accept" when it asks for permissions.

### Firefox (Greasemonkey):

1. Install Greasemonkey, if you have not already done so.
2. Extract this zip file into an empty folder.
3. Open Firefox, then uninstall any previous versions (if applicable).
4. Drag and drop "{1}.user.js" into the Firefox window.
5. Click "Install" after the timer countdown finishes.

How to Use
----------

Load up GEFS and open the Nav panel. To activate the master switch, click the
"disconnected" button. Once the master switch is enabled, click the "Hdg",
"Alt" or "Spd" buttons to activate the specific modes.

Click the "Heading Mode" button to switch between heading mode, lat/long mode
and ICAO airport mode. In the non-heading modes, the lateral mode of the
autopilot is always activiated -- to turn the lateral mode off, first switch
to "Heading Mode", then click "Hdg".

Licence
-------

This is free, open source software released under the GNU GPLv3. For the source
code of this program, see <http://github.com/Qantas94Heavy/autopilot-pp>. The
full license (GNU General Public License, Version 3) is available any time at
<http://www.gnu.org/licenses/gpl-3.0.html>.

Release Notes
-------------

### Fixed bugs:

 - Activating the throttle control on some platforms no longer hangs GEFS
 - Significant internal reworking to make future improvements easier to add

### New features:

 - Clicking the KIAS label will convert the speed to Mach and vice versa.
