'use strict';

require.config(
{ paths: { knockout: 'node_modules/knockout/build/output/knockout-latest' }
, enforceDefine: true
});

// Create the user interface for users to interact with Autopilot++.
// TODO: add current mode indicator
define([ 'knockout', 'autopilot', 'ui/apdisconnectsound', 'ui/autopilot', 'enablekcas'
       , 'bugfixes/papi', 'bugfixes/restrictions', 'text!ui/ui.html', 'text!ui/ui.css'
       ], function (ko, ap, apDisconnectSound, AutopilotVM, enableKcas,
                    papiBugfix, restrictionsBugfix, uihtml, uicss) {
  function stopImmediatePropagation(event) {
    event.stopImmediatePropagation();
  }

  function init() {
    // Apply CSS for Autopilot++ to the document.
    $('<style>').text(uicss).appendTo('head');

    // Replace CSS class to avoid nasty override issues with GEFS styling.
    var $ap = $('.geofs-autopilot')
      .removeClass('geofs-autopilot')
      .prop('id', 'Qantas94Heavy-ap')
      .keydown(stopImmediatePropagation)
      .html(uihtml);

    // Set ` key for autopilot disconnect, like the red sidestick button.
    document.addEventListener('keydown', function () {
      // Use KeyboardEvent.code if supported, otherwise use KeyboardEvent.which.
      if ('code' in event) {
        if (event.code === 'Backquote') ap.turnOff();
      }
      else if (event.which === 192) ap.turnOff();
    });

    // Play autopilot disconnect sound when autopilot is turned off.
    ap.on.subscribe(function (newValue) {
      if (!newValue && geofs.preferences.sound) apDisconnectSound.play();
    });

    papiBugfix();
    if (!DEBUG) restrictionsBugfix();
    enableKcas();

    var viewModel = new AutopilotVM();
    ko.applyBindings(viewModel, $ap[0]);

    // GEFS's use of the Material Design Lite library requires that components dynamically added
    // are 'upgraded' manually.
    /* global componentHandler */
    componentHandler.upgradeElements($ap[0]);
    return viewModel;
  }

  return init;
});
