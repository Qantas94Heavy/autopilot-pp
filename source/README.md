README
======

Autopilot++ v{0} for GEFS-Online

Installation Instructions
-------------------------

> Please note that Internet Explorer and Microsoft Edge are *not* supported.

### Firefox (recommended):

1. Install Greasemonkey, if you have not already done so.
2. Extract this ZIP file into an empty folder.
3. Open Firefox, then drag and drop "{1}.user.js" into the Firefox window.
4. Click "Install" after the timer countdown finishes.

### Google Chrome for Windows:

1. Install Tampermonkey, if you have not already done so.
2. Extract this ZIP file into an empty folder.
3. Open Google Chrome, then click Menu -> More tools -> Extensions.
4. Find the Tampermonkey extension, then tick "Allow access to file URLs".
5. Open a new tab, then drag and drop "{1}.user.js" into the window.
6. Click "Install" in the window that appears.

### Google Chrome (other) and Chromium:

**Note: users of Google Chrome on Windows _must_ use the method above to
install Autopilot++, not this method.**

1. Extract this ZIP file into an empty folder.
2. Open Google Chrome/Chromium, then click on the menu button at the top right.
3. Hover over the Tools sub-menu, then click on Extensions.
4. If applicable, uninstall any previous versions of the plugin.
5. Drag and drop "{2}.crx" into the Extensions page.
6. Click "Accept" when it asks for permissions.

### Opera 15+:

1. Extract this ZIP file into an empty folder.
2. Open Opera, then click on the Opera menu button and click Extensions.
3. Drag and drop "{2}.crx" into the Extensions page.
4. Click Install on the popup.

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

This is free, open source software released under the [GNU General Public
License][1], version 3 or later.  Version 3 of the GPL is also included in
LICENSE.html for your reference.

For the source code of this program, see [GitHub][2].

  [1]: http://www.gnu.org/licenses/gpl-3.0.html
  [2]: http://github.com/Qantas94Heavy/autopilot-pp

Release Notes
-------------

### Changes in this version

 - Fixes bug with KCAS code that intermittently causes GEFS to stop running

### Changes in v0.9.1 (last version)

 - Fixes several bugs with loading and PAPI functioning
 - Reduce the size of Autopilot++ with smaller embedded audio file

### Changes in v0.9.0 (last major version)

This version now supports the Cesium version of GEFS.

Also, the README file is now converted to an HTML file for easier viewing.
