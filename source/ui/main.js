'use strict';

define(['greatcircle', 'autopilot/main', 'icaoairports', 'waypoints', 'ui/apdisconnectsound'
       , 'text!ui/ui.html', 'text!ui/ui.css', 'bugfixes', 'kcas'
       ], function (gc, autopilot, icaos, waypoints, apDisconnectSound, uihtml, uicss) {
  /* MAKE THE USER INTERFACE */
  $('head').append($('<style>').text(uicss));
  $('.gefs-autopilot').replaceWith(uihtml);
  
  // set ` key for autopilot disconnect, like the red sidestick button
  $(document).keydown(function (event) {
    if (event.which === 192) autopilot.turnOff();
  });
  
  var apModes = autopilot.modes;
  var altitude = apModes.altitude;
  var heading = apModes.heading;
  var speed = apModes.speed;
  var vs = apModes.vs;
    
  function toggleAutopilot() {
    if (autopilot.on) autopilot.turnOff();
    else {
      var altVal = $('#Qantas94Heavy-ap-alt > input').val();
      var hdgVal = $('#Qantas94Heavy-ap-hdg > input').val();
      var spdVal = $('#Qantas94Heavy-ap-spd > input').val();
      var vsVal = $('#Qantas94Heavy-ap-vs > input').val();
      
      autopilot.turnOn();
      
      if (altVal) altitude.set(altVal);
      if (hdgVal) heading.set(hdgVal);
      if (spdVal) speed.set(spdVal);
      if (vsVal) vs.set(vsVal);
    }
  }
  
  function enableHeading() {
    if (!heading.isEnabled) {
      heading.enable();
      $('#Qantas94Heavy-ap-hdg > span[data-type="name"]').addClass('btn-warning');
    }
  }
  
  var $window = $(window);
  
  $window.on('autopilotengaged', function () {
    $('#Qantas94Heavy-ap-toggle')
      .text('Engaged')
      .addClass('btn-warning');

    if (currentMode !== 0) enableHeading();
  }).on('autopilotdisengaged', function () {
    $('#Qantas94Heavy-ap-alt, #Qantas94Heavy-ap-hdg, #Qantas94Heavy-ap-spd')
      .children('span[data-type="name"]')
      .removeClass('btn-warning');

    $('#Qantas94Heavy-ap-toggle')
      .text('Disengaged')
      .removeClass('btn-warning');

    if (gefs.preferences.sound) apDisconnectSound.play();
  });
  
  // create heading/great circle mode toggle button
  // allow referencing the current mode when toggling
  var currentMode = 0;
  var modes = ['Heading mode', 'GC mode (lat/long)', 'Great Circle (ICAO)'];
  var divs = [$('#Qantas94Heavy-ap-hdg'), $('.Qantas94Heavy-gc-container'), $('#Qantas94Heavy-ap-icao')];
  
  for (var i = 1; i < divs.length; ++i) divs[i].hide();
  
  // write our own toggle function to avoid compatibility issues
  $('#Qantas94Heavy-ap-toggle').click(toggleAutopilot);
  
  $('#Qantas94Heavy-ap-mode').click(function () {
    if (currentMode < modes.length - 1) ++currentMode;
    else currentMode = 0;
    
    if (currentMode === 0) gc.disable();
    else if (currentMode === 1) gc.enable();
    
    for (var i = 0; i < divs.length; ++i) divs[i].toggle(i === currentMode);
    
    $(this).text(modes[currentMode]);
  });
  
  $('#Qantas94Heavy-ap-alt').children('input').change(function () {
    $(this).val(function (_, val) {
      var newAlt = parseInt(val, 10);
      altitude.set(newAlt);
      return altitude.value;
    });
  }).end().children('span[data-type="name"]').click(function () {
    if (autopilot.on) {
      altitude[altitude.isEnabled ? 'disable' : 'enable']();
      $(this).toggleClass('btn-warning', altitude.isEnabled);
    }
  });
  
  $('#Qantas94Heavy-ap-vs > input').change(function () {
    var newVs = this.value;
    if (newVs) vs.set(parseInt(newVs, 10));
    else vs.set(null);
  });
  
  $window.on('autopilotvsenabled', function () {
    $('#Qantas94Heavy-ap-vs > input').val(vs.value);
  });
  
  $window.on('autopilotvsdisabled', function () {
    $('#Qantas94Heavy-ap-vs > input').val('');
  });
  
  $('#Qantas94Heavy-ap-hdg').children('input').change(function () {
    $(this).val(function (_, val) {
      var newHdg = parseInt(val, 10);
      heading.set(newHdg);
      return heading.value;
    });
  }).end().children('span[data-type="name"]').click(function () {
    if (autopilot.on) {
      heading[heading.isEnabled ? 'disable' : 'enable']();
      $(this).toggleClass('btn-warning', heading.isEnabled);
    }
  });
  
  $('#Qantas94Heavy-ap-gc-lat > input').change(function () {
    enableHeading();
    gc.setLatitude(this.value);
    $(this).val(gc.getLatitude());
  });
  
  $('#Qantas94Heavy-ap-gc-lon > input').change(function () {
    enableHeading();
    gc.setLongitude(this.value);
    $(this).val(gc.getLongitude());
  });
  
  // allow ICAO airport codes input  
  $('#Qantas94Heavy-ap-icao > input')
    .change(function () {
      var $this = $(this);
      var inputVal = $this.val();
      
      // ICAO codes are uppercase
      var code = inputVal.trim().toUpperCase();
      var coord = icaos[code];
      if (!coord) coord = waypoints[code];
      
      if (coord) {
        enableHeading();
        
        var lat = coord[0];
        var lon = coord[1];
        
        gc.setLatitude(lat);
        gc.setLongitude(lon);
        
        $('#Qantas94Heavy-ap-gc-lat > input').val(lat);
        $('#Qantas94Heavy-ap-gc-lon > input').val(lon);
        
        if (inputVal !== code) $this.val(code);
      } else {
        $this.val('');
        // TODO: replace with proper UI warning
        alert('Sorry, code "' + inputVal + '" is an invalid or unrecognised ICAO airport code.');
      }
    });
    
  var spdDiv = $('#Qantas94Heavy-ap-spd');
  
  spdDiv.children('input').change(function () {
    $(this).val(function (_, val) {
      var newSpd = speed.isMach ? parseFloat(val) : parseInt(val, 10);
      speed.set(newSpd);
      return speed.value;
    });
  });
  
  spdDiv.children('span[data-type="name"]').click(function () {    
    if (autopilot.on) {
      speed[speed.isEnabled ? 'disable' : 'enable']();
      $(this).toggleClass('btn-warning', speed.isEnabled);
    }
  });
  
  // toggle between KIAS or mach mode
  spdDiv.children('span[data-type="unit"]').click(function () {
    speed.isMach = !speed.isMach;
    
    if (speed.isMach) {
      $(this).text('M.');
      speed.toMach();
    } else {
      $(this).text('KIAS');
      speed.toKias();
    }
    
    spdDiv.children('input').val(speed.value);
  });
  
  function stopPropagation(event) {
    event.stopPropagation();
  }
  
  $('.gefs-autopilot input')
    .keydown(stopPropagation)
    .keyup(stopPropagation);
});