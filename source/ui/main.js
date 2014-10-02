'use strict';

define(['greatcircle', 'autopilot/main', 'icaoairports', 'ui/apdisconnectsound', 'text!ui/ui.html', 'text!ui/ui.css', 'bugfixes', 'kcas'],
        function (gc, autopilot, icaos, apDisconnectSound, uihtml, uicss) {
  /* MAKE THE USER INTERFACE */
  $('head').append($('<style>').text(uicss));
  $('.gefs-autopilot').replaceWith(uihtml);
  
  // set ` key for autopilot disconnect, like the red sidestick button
  $(document).keydown(function (event) {
    if (event.which === 192) autopilot.turnOff();
  });
  
  var altitude = autopilot.modes.altitude;
  var heading = autopilot.modes.heading;
  var speed = autopilot.modes.speed;
  var vs = autopilot.modes.vs;
    
  function toggleAutopilot() {
    if (autopilot.on) autopilot.turnOff();
    else {
      var altVal = $('#Qantas94Heavy-ap-alt').val();
      var hdgVal = $('#Qantas94Heavy-ap-hdg').val();
      var spdVal = $('#Qantas94Heavy-ap-spd').val();
      var vsVal = $('#Qantas94Heavy-ap-vs').val();
      
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
      $('#Qantas94Heavy-ap-hdg-span').addClass('btn-warning');
    }
  }
  
  var $window = $(window);
  
  $window.on('autopilotengaged', function () {
    $('#Qantas94Heavy-ap-toggle')
      .text('Engaged')
      .addClass('btn-warning');

    if (currentMode !== 0) enableHeading();

  });
  
  $window.on('autopilotdisengaged', function () {
    $('#Qantas94Heavy-ap-alt-span, #Qantas94Heavy-ap-hdg-span, #Qantas94Heavy-ap-spd-span').removeClass('btn-warning');

    $('#Qantas94Heavy-ap-toggle')
      .text('Disengaged')
      .removeClass('btn-warning');

    if (ges.preferences.sound) apDisconnectSound.play();

  });
  
  // create heading/great circle mode toggle button
  // allow referencing the current mode when toggling
  var currentMode = 0;
  var modes = ['Heading mode', 'GC mode (lat/long)', 'Great Circle (ICAO)'];
  var divs = [$('#Qantas94Heavy-ap-hdg-div'), $('#Qantas94Heavy-ap-gc-div'), $('#Qantas94Heavy-ap-icao-div')];
  
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
  
  $('#Qantas94Heavy-ap-alt-span').click(function () {
    if (autopilot.on) {
      altitude[altitude.isEnabled ? 'disable' : 'enable']();
      $(this).toggleClass('btn-warning', altitude.isEnabled);
    }
  });
  
  $('#Qantas94Heavy-ap-alt').change(function () {
    $(this).val(function (_, val) {
      var newAlt = parseInt(val, 10);
      altitude.set(newAlt);
      return altitude.value;
    });
  });
  
  $('#Qantas94Heavy-ap-vs').change(function () {
    var newVs = this.value;
    if (newVs) vs.set(parseInt(newVs, 10));
    else vs.set(null);
  });
  
  $window.on('autopilotvsenabled', function () {
    $('#Qantas94Heavy-ap-vs').val(vs.value);
  });
  
  $window.on('autopilotvsdisabled', function () {
    $('#Qantas94Heavy-ap-vs').val('');
  });
  
  $('#Qantas94Heavy-ap-hdg-span').click(function () {
    if (autopilot.on) {
      heading[heading.isEnabled ? 'disable' : 'enable']();
      $(this).toggleClass('btn-warning', heading.isEnabled);
    }
  });
  
  $('#Qantas94Heavy-ap-hdg').change(function () {
    $(this).val(function (_, val) {
      var newHdg = parseInt(val, 10);
      heading.set(newHdg);
      return heading.value;
    });
  });
  
  $('#Qantas94Heavy-ap-gc-lat').change(function () {
    enableHeading();
    gc.setLatitude(this.value);
    $(this).val(gc.getLatitude());
  });
  
  $('#Qantas94Heavy-ap-gc-lon').change(function () {
    enableHeading();
    gc.setLongitude(this.value);
    $(this).val(gc.getLongitude());
  });
  
  // allow ICAO airport codes input
  function stopPropagation(event) {
    event.stopPropagation();
  }
  
  $('#Qantas94Heavy-ap-icao')
    .keydown(stopPropagation)
    .keyup(stopPropagation)
    .change(function () {
      var $this = $(this);
      var inputVal = $this.val();
      
      // ICAO codes are uppercase
      var code = inputVal.trim().toUpperCase();
      
      if (icaos[code]) {
        enableHeading();
        
        var lat = icaos[code][0];
        var lon = icaos[code][1];
        
        gc.setLatitude(lat);
        gc.setLongitude(lon);
        
        $('#Qantas94Heavy-ap-gc-lat').val(lat);
        $('#Qantas94Heavy-ap-gc-lon').val(lon);
        
        if (inputVal !== code) $this.val(code);
      } else {
        $this.val('');
        // TODO: replace with proper UI warning
        alert('Sorry, code "' + inputVal + '" is an invalid or unrecognised ICAO airport code.');
      }
    });
    
  $('#Qantas94Heavy-ap-spd-span').click(function () {    
    if (autopilot.on) {
      speed[speed.isEnabled ? 'disable' : 'enable']();
      $(this).toggleClass('btn-warning', speed.isEnabled);
    }
  });
  
  $('#Qantas94Heavy-ap-spd').change(function () {
    $(this).val(function (_, val) {
      var newSpd = speed.isMach ? parseFloat(val) : parseInt(val, 10);
      speed.set(newSpd);
      return speed.value;
    });
  });
  
  // toggle between KIAS or mach mode
  $('#Qantas94Heavy-ap-spd-mach').click(function () {
    speed.isMach = !speed.isMach;
    
    if (speed.isMach) {
      $(this).text('M.');
      speed.toMach();
    } else {
      $(this).text('KIAS');
      speed.toKias();
    }
    
    $('#Qantas94Heavy-ap-spd').val(speed.value);
  });
});