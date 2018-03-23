README
======

Autopilot++ v{0} for GeoFS

How to Use
----------

First install Autopilot++ using the installation instructions below.

After installing Autopilot++, load GeoFS and open the "Nav" panel.  To activate
the master switch, click the "Disengaged" button.  Once the master switch is
enabled, toggle the sliders next to "Altitude", "Heading" or "Speed" to
activate these modes.

### Navigation Modes

Click the "Heading mode" button to switch between the following modes:

 - Heading mode
 - Lat/lon mode
 - Waypoint mode

In the non-heading modes, the lateral mode of the autopilot is
always activated.  To turn the lateral mode off, first switch to
"Heading mode", then toggle the switch for "Heading".

### Vertical Speed

"-----" indicates that vertical speed (V/S) is under automatic control.

To set the V/S manually, click the V/S input and enter the value to set.

To return V/S to automatic control, clear the input and click outside the
input field or press Enter.

Installation Instructions
-------------------------

> Please note that Internet Explorer is *not* supported.

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

### Microsoft Edge (14.14393+):

1. Install Tampermonkey, if you have not already done so.
2. Extract this ZIP file into an empty folder.
5. Open Microsoft Edge, then drag and drop "{1}.user.js" into the window.
6. Click "Install" in the window that appears.

### Google Chrome and Chromium:

**Note: users of Google Chrome on Windows _must_ use the method above to
install Autopilot++, not this method.**

1. Extract this ZIP file into an empty folder.
2. Open Google Chrome/Chromium, then click on the menu button at the top right.
3. Hover over the Tools sub-menu, then click on Extensions.
4. If applicable, uninstall any previous versions of the plugin.
5. Drag and drop "{2}.crx" into the Extensions page.
6. Click "Accept" when it asks for permissions.

### Opera (15+):

1. Extract this ZIP file into an empty folder.
2. Open Opera, then click on the Opera menu button and click Extensions.
3. Drag and drop "{2}.crx" into the Extensions page.
4. Click Install on the popup.

Licence
-------

    Copyright (c) 2013-2018 Karl Cheng
    Email: <qantas94heavy@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

[Version 3 of the GPL][1] is included in LICENSE.html for your reference.

For the source code of this program, see [GitHub][2].

  [1]: http://www.gnu.org/licenses/gpl-3.0.html
  [2]: http://github.com/Qantas94Heavy/autopilot-pp

Release Notes
-------------

### Changes in v0.11.2 (current version)

 - Allow Autopilot++ to load on the HTTPS version of the GeoFS website

### Changes in v0.11.1 (last version)

 - Fix Autopilot++ not loading due to change in GeoFS PAPI implementation

### Changes in v0.11.0

 - Fix playback of autopilot disconnect sound
 - Fix autopilot not levelling off or descending for some aircraft
 - Fix display of V/S changes
 - Fix UI toggle buttons
 - Update to newer version of waypoint data
 - Internal code fixes and improvements

### Changes in v0.10.6

 - Update Autopilot++ loading code to work with changes to GeoFS

### Changes in v0.10.5

 - Fix error in code that prevented autopilot from running

### Changes in v0.10.4

 - Update code to support new GeoFS website

### Changes in v0.10.3

 - Fix bug in internal code that prevented GEFS from loading

### Changes in v0.10.2

 - Fix compatibility issue caused by update to GEFS 1.4c
 - Fix issue with speed restrictions code and allow use by community aircraft
 - Fix input focus issue where pressing certain keys would trigger other functions

### Changes in v0.10.1

 - Fix issue with mixed roll and yaw not working properly

### Changes in v0.10.0

 - Redesign of user interface and internal code to support GEFS 1.2c
 - Improved autopilot control smoothness
 - Update waypoints and ICAO airport database
 - A little surprise?! ;)

### Changes in v0.9.2

 - Fixes bug with KCAS code that intermittently causes GEFS to stop running

### Changes in v0.9.1

 - Fixes several bugs with loading and PAPI functioning
 - Reduce the size of Autopilot++ with smaller embedded audio file

### Changes in v0.9.0

This version now supports the Cesium version of GEFS.

Also, the README file is now converted to an HTML file for easier viewing.
