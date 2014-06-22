'use strict';

define(['greatcircle', 'autopilot/main', 'text!ui/ui.html', 'text!ui/ui.css', 'bugfixes', 'kcas'],
        function (gc, autopilot, uihtml, uicss) {
  /* MAKE THE USER INTERFACE */
  $('head').append($('<style>').text(uicss));
  
  $('.gefs-autopilot').replaceWith(uihtml);
  
  // set ` key for autopilot disconnect, like the red sidestick button
  $(document).keydown(function (event) {
    if (event.which === 192) toggleAutopilot(false);
  });
  
  // TODO: move to a proper host in the future
  var apDisconnectSound = new Audio('http://dl.dropbox.com/s/uyqz78wget1tetj/test3.mp3');
    
  function toggleAutopilot(turnOn) {
    if (turnOn) {
      var altitude = parseInt($('#Qantas94Heavy-ap-alt').val(), 10);
      var heading = parseInt($('#Qantas94Heavy-ap-hdg').val(), 10);
      var speed = parseInt($('#Qantas94Heavy-ap-spd').val(), 10);
      
      autopilot.turnOn(altitude, heading, speed);
    } else autopilot.turnOff();
  }
  
  $(window).on('autopilotengaged', function () {
    $('#Qantas94Heavy-ap-toggle')
      .text('Engaged')
      .addClass('btn-warning');
    
    if (currentMode !== 0) enableHeading();
  });
  
  $(window).on('autopilotdisengaged', function () {
    $('#Qantas94Heavy-ap-alt-span, #Qantas94Heavy-ap-hdg-span, #Qantas94Heavy-ap-spd-span').removeClass('btn-warning');
    
    $('#Qantas94Heavy-ap-toggle')
      .text('Disengaged')
      .removeClass('btn-warning');
      
    apDisconnectSound.play();
  });
  
  // create heading/great circle mode toggle button
  // allow referencing the current mode when toggling
  var currentMode = 0;
  var modes = ['Heading mode', 'GC mode (lat/long)', 'Great Circle (ICAO)'];
  var divs = [$('#Qantas94Heavy-ap-hdg-div'), $('#Qantas94Heavy-ap-gc-div'), $('#Qantas94Heavy-ap-icao-div')];
  
  // write our own toggle function to avoid compatibility issues
  $('#Qantas94Heavy-ap-toggle').click(function () {
    toggleAutopilot(!autopilot.on);
  });
  
  $('#Qantas94Heavy-ap-mode').click(function () {
    if (currentMode < modes.length - 1) ++currentMode;
    else currentMode = 0;
    
    if (currentMode === 0) gc.disable();
    else if (currentMode === 1) gc.enable();
    
    for (var i = 0; i < divs.length; ++i) divs[i].toggle(i === currentMode);
    
    $(this).text(modes[currentMode]);
    
    console.log(modes[currentMode], currentMode);
  });
  
  var altitude = autopilot.modes.altitude;
  var heading = autopilot.modes.heading;
  var speed = autopilot.modes.speed;
  
  $('#Qantas94Heavy-ap-alt-span').click(function () {
    if (autopilot.on) {
      if (altitude.isEnabled) {
        altitude.disable();
        $(this).removeClass('btn-warning');
      } else {
        altitude.enable();
        $(this).addClass('btn-warning');
      }
    }
  });
  
  $('#Qantas94Heavy-ap-alt').change(function () {
    $(this).val(function (_, val) {
      var newAlt = parseInt(val, 10);
      autopilot.modes.altitiude.set(newAlt);
      return autopilot.modes.altitiude.value;
    });
  });
  
  $('#Qantas94Heavy-ap-vs').change(function () {
    var vs = parseInt(this.value, 10);
    autopilot.vs.set(vs);
  });
  
  $('#Qantas94Heavy-ap-hdg-span').click(function () {
      if (autopilot.on) {
        if (heading.isEnabled) {
          heading.disable();
          $(this).removeClass('btn-warning');
        } else {
          heading.enable();
          $(this).addClass('btn-warning');
        }
      }
  });
  
  $('#Qantas94Heavy-ap-hdg').change(function () {
    var newHdg = parseInt(this.value, 10);
    autopilot.heading.set(newHdg);
    $(this).val(autopilot.heading.value);
  });
  
  function enableHeading() {
    if (!heading.isEnabled) {
      heading.enable();
      $('#Qantas94Heavy-ap-hdg').addClass('btn-warning');
    }
  }
  
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
        gc.setLatitude(icaos[code][0]);
        gc.setLongitude(icaos[code][1]);
        
        if (inputVal !== code) $this.val(code);
      } else {
        $this.val('');
        // TODO: replace with proper UI warning
        alert('Sorry, code "' + inputVal + '" is an invalid or unrecognised ICAO airport code.');
      }
    });
    
    $('#Qantas94Heavy-ap-spd-span').click(function () {    
      if (autopilot.on) {
        if (speed.isEnabled) {
          speed.disable();
          $(this).removeClass('btn-warning');
        } else {
          speed.enable();
          $(this).addClass('btn-warning');
        }
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
      $(this).text('Mach');
      speed.toMach();
    } else {
      $(this).text('KIAS');
      speed.toKias();
    }
    
    $('#Qantas94Heavy-ap-spd').val(speed.value);
  });
});