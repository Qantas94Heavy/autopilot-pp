// make sure that damm DOM is ready
jQuery(function ($, undefined)
{	// check no idiot's gone retarded
	var Infinity = 1e999;
	var NaN = Number.NaN;
	var metersToFeet = 3.2808398950131235;
	
	// fix up the look of bad "inputs"
	$('head').append($('<style>').text('.gefs-autopilot .input-prepend div, .gefs-autopilot .input-append div { margin-bottom: 1px; display: inline-block; }'));

	// fix up the GEFS autopilot functions
	var autopilot = controls.autopilot;
	$.extend(autopilot,
	{ setHeading: function (heading)
		{	var newHdg = fixAngle360(parseInt(heading, 10));
			$('.gefs-autopilot-heading').val(newHdg === newHdg ? autopilot.heading = newHdg : autopilot.heading); // deliberate assignment, check for NaN
		}
	, setAltitude: function (altitude)
		{	var newAlt = parseInt(altitude, 10);
			$('.gefs-autopilot-altitude').val(newAlt === newAlt ? autopilot.altitude = newAlt : autopilot.altitude); // deliberate assignment, check for NaN
		}
	, setKias: function (kias)
		{	var newSpd = parseInt(kias, 10);
			$('.gefs-autopilot-kias').val(newSpd === newSpd ? autopilot.kias = newSpd : autopilot.kias); // deliberate assignment, check for NaN
		}
	, update: function (dt)
		{	var values = ges.aircraft.animationValue;
			var ap = controls.autopilot;
			var speedRatio = clamp(values.kias / 100, 1, 5);
			var deltaHeading = fixAngle(values.heading - ap.heading);
			var targetBankAngle = clamp(deltaHeading, -ap.maxBankAngle, ap.maxBankAngle);
			// check no idiot attempts to "autoland" with the autopilot
			if (values.altitude - ges.groundElevation * metersToFeet < 500)
			{	controls.autopilot.turnOff();
				return;
			}
			controls.yaw = exponentialSmoothing('apYaw', targetBankAngle / -60, 0.1);
			ap.rollPID.set(targetBankAngle);
			controls.roll = exponentialSmoothing('apRoll', -ap.rollPID.compute(values.aroll, dt) / speedRatio, 0.9);
			var deltaAltitude = ap.altitude - values.altitude;
			var maxClimbRate = clamp(speedRatio * ap.commonClimbrate, 0, ap.maxClimbrate);
			var maxDescentRate = clamp(speedRatio * ap.commonDescentrate, ap.maxDescentrate, 0);
			var targetClimbrate = clamp(deltaAltitude * 5, maxDescentRate, maxClimbRate);
			ap.climbPID.set(-targetClimbrate);
			var currentClimbRate = clamp(values.climbrate, maxDescentRate, maxClimbRate);
			var aTargetTilt = clamp(ap.climbPID.compute(-currentClimbRate, dt) / speedRatio, -ap.maxPitchAngle, -ap.minPitchAngle);
			ap.pitchPID.set(-aTargetTilt);
			controls.rawPitch = exponentialSmoothing('apPitch', ap.pitchPID.compute(-values.atilt, dt) / speedRatio, 0.9);
			ges.debug.watch('targetClimbrate', targetClimbrate);
			ges.debug.watch('aTargetTilt', aTargetTilt);
			ap.throttlePID.set(ap.kias);
			controls.throttle = clamp(exponentialSmoothing('apThrottle', ap.throttlePID.compute(values.kias, dt), 0.9), 0, 1);
			ges.debug.watch('throttle', controls.throttle);
		}
	, turnOn: function ()
		{	if (!ges.aircraft.setup.autopilot) return;
			var values = ges.aircraft.animationValue;
			var autopilot = controls.autopilot;
			autopilot.climbPID.reset();
			autopilot.pitchPID.reset();
			autopilot.rollPID.reset();
			autopilot.throttlePID.reset();
			autopilot.setAltitude($('.gefs-autopilot-altitude').val());
			autopilot.setHeading($('.gefs-autopilot-heading').val());
			autopilot.setKias($('.gefs-autopilot-kias').val());
			ui.hud.autopilotIndicator(autopilot.on = true); // deliberate assignment
			$('.gefs-autopilot-toggle')
				.first()
				.text('Engaged')
				.addClass('btn-warning');
		}
	, turnOff: function ()
		{	ui.hud.autopilotIndicator(controls.autopilot.on = false); // deliberate assignment
			$('.gefs-autopilot-toggle')
				.first()
				.text('Disengaged')
				.removeClass('btn-warning');
		}
	});
	
	// create global great circle public interface
	(function init()
	{	function setHeading() { controls.autopilot.setHeading(Math.round(gc.getHeading(lat, lon))); }
		function fixAngle360(angle)
		{	while (angle < 0) angle += 360;
			while (angle >= 360) angle -= 360;
			return angle;
		}
		var timer, lat, lon;
		var status = 'off';
		var decimalsOnly = /^-?\d+\.?\d*$/;
		// make sure ges.aircraft exists - if not try again later
		if (!(typeof ges === 'object' && ges.aircraft))
		{	setTimeout(function () { window.gc = init(); }, 1000);
			return;
		}
		var aircraft = ges.aircraft;
		var atan2 = Math.atan2;
		var sin = Math.sin;
		var cos = Math.cos;
		var degreesToRad = 0.017453292519943295;
		var radToDegrees = 57.29577951308232;
		var twoPi = 6.283185307179586;

		window.gc =
			{ getLat: function () { return lat; }
			, getLon: function () { return lon; }
			, getHeading: function ()
				{   var coords = aircraft.getCurrentCoordinates();
					var lat1 = coords[0] * degreesToRad;
					var lon1 = coords[1] * degreesToRad;
					var lat2 = lat * degreesToRad;
					var lon2 = lon * degreesToRad;
					return fixAngle360(
						atan2(
							sin(lon2 - lon1) * cos(lat2),
							cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lon2 - lon1)
						) % twoPi * radToDegrees
					);
				}
			, on: function ()
				{   clearInterval(timer);
					timer = setInterval(setHeading, 1000);
					status = 'on';
				}
			, off: function ()
				{   clearInterval(timer);
					timer = null;
					status = 'off';
				}
			, getStatus: function () { return status; }
			, setLatitude: function (newLat, calledByInput)
				{   if (decimalsOnly.test(newLat)) lat = parseFloat(newLat);
					if (calledByInput) $('Qantas94Heavy-gc-lat').val(lat + '');
				}
			, setLongitude: function (newLon, calledByInput)
				{   if (decimalsOnly.test(newLon)) lon = parseFloat(newLon);
					if (calledByInput) $('Qantas94Heavy-gc-lon').val(lon + '');
				}
			};
	})();
	
	// make the user interface
	var mode = 'Heading mode'; // allow referencing current mode when toggling
	// reference original heading div it so that we can toggle visibility easier
	var hdgDiv = $('.gefs-autopilot-heading')
		.first()
		.parent();
	// create container to store both buttons
	var btnDiv = $('<div>')
		.width('100%')
		.css('display', 'inline-block'); // COMPAT: not compatible with IE6/7 without some hacks
	// reference autopilot toggle button so that we can move it to outer div
	var onOff = $('.gefs-autopilot-toggle')
		.first()
		.css('margin', '0 5% 5px')
		.width('40%');
	
	// create heading/great circle mode toggle button
	var gcOrHdg = $('<button>')
		.addClass('btn btn-mini gefs-autopilot-toggle')
		.css('margin', '0 5% 5px')
		.width('40%')
		.text('Heading mode')
		.click(function ()
		{	if (mode === 'Heading mode')
			{	hdgDiv.hide();
				gcDiv.css('display', 'inline-block');
				gcOrHdg.text(mode = 'Great Circle mode'); // deliberate assignment
				gc.on();
			} else
			{	hdgDiv.css('display', 'inline-block');
				gcDiv.hide();
				gcOrHdg.text(mode = 'Heading mode'); // deliberate assignment
				gc.off();
			}
		});
	
	// create container to store lat and lon inputs
	var gcDiv = $('<div>')
		.attr('id', 'Qantas94Heavy-gc-div')
		.hide();
	
	// latitude div container
	var latDiv = $('<div>')
		.addClass('input-prepend')
		.css('margin', '0 10px 0 0')
		.css('float', 'left');
	
	// latitude input panel
	var latSpan = $('<span>')
		.addClass('add-on')
		.text('Lat.');
	
	var latInput = $('<input>')
		.attr('id', 'Qantas94Heavy-gc-lat')
		.attr('type', 'text')
		.addClass('span1')
		.change(function (event) { gc.setLatitude(event.target.value, true); });

	// longitude div container
	var lonDiv = $('<div>')
		.addClass('input-prepend')
		.css('margin', '0 0 0 10px')
		.css('float', 'right');
	
	// longitude input panel
	var lonSpan = $('<span>')
		.addClass('add-on')
		.text('Lon.');
	
	var lonInput = $('<input>')
		.attr('id', 'Qantas94Heavy-gc-lon')
		.attr('type', 'text')
		.addClass('span1')
		.change(function (event) { gc.setLongitude(event.target.value, true); });
	
	// put the stuff together
	onOff.after(btnDiv);
	btnDiv.append(onOff, gcOrHdg);
	latDiv.append(latSpan, latInput);
	lonDiv.append(lonSpan, lonInput);
	gcDiv
		.append(latDiv, lonDiv)
		.insertAfter(hdgDiv)
});