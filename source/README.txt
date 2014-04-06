README
======

Autopilot++ for GEFS-Online v{0} for Google Chrome/Chromium & Greasemonkey

LICENSE
-------

This is free, open source software released under the GNU GPLv3. For the source
code of this program, see <http://github.com/Qantas94Heavy/autopilot-pp>. The
full license (GNU General Public License, Version 3) is available any time at
<http://www.gnu.org/licenses/gpl-3.0.html>.

INSTALLATION INSTRUCTIONS (Chrome)
----------------------------------

1. Extract this zip file into an empty folder.
2. Open Google Chrome/Chromium, then click on the menu button at the top right.
3. Hover over the Tools sub-menu, then click on Extensions.
4. If applicable, uninstall any previous versions of the plugin.
5. Drag and drop "gefs_gc-setup.crx" into the Extensions page.
6. Click "Accept" when it asks for permissions.
7. Installed!  Just open GEFS and enjoy your "new and improved" autopilot!

INSTALLATION INSTRUCTIONS (Greasemonkey)
----------------------------------------

1. Install Greasemonkey, if you have not already done so.
2. Extract this zip file into an empty folder.
3. Open Firefox, then uninstall any previous versions (if applicable).
4. Drag and drop "{1}.user.js" into the Firefox window.
5. Click "Install" after the timer countdown finishes.
6. Installed!  Just open GEFS and enjoy your "new and improved" autopilot!

HOW TO USE
----------

Load up GEFS and open the Nav panel. To activate the master switch, click the
"disconnected" button. Once the master switch is enabled, click the "Hdg", "Alt"
or "Spd" buttons to activate the specific modes. Click the "Heading Mode" button
to switch between heading mode, lat/long mode and ICAO airport mode. In the non-
heading modes, the lateral mode of the autopilot is always activiated -- to
turn the lateral mode off, first switch to "Heading Mode", then click "Hdg".

CHANGES SINCE v0.5.2 (last version)
-----------------------------------

 - New CAS mode -- airspeed indicator now shows CAS instead of TAS

CHANGES SINCE v0.5.1
--------------------

 - Fixed issue with PID controller setting making SU-35 and Concorde unstable

CHANGES SINCE v0.5.0 (last major version)
-----------------------------------------

 - Fixed bug where the new ICAO airports database was not being included