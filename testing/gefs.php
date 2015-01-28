
<!DOCTYPE HTML>
<script type="text/javascript">
  var ges = window.ges || {};

  ges.multiplayerHost = 'http://net.gefs-online.com:8080';

  ges.userAccount = {
    'id': '',
    'sessionId': '6568rk6mkur5m1rk25lrcubuq1',
    'muteArray': []
  };
  
  ges.userAccount.muteList = {};
  for (i = 0, l = ges.userAccount.muteArray.length; i < l; i++) {
    ges.userAccount.muteList[ges.userAccount.muteArray[i]] = 1;   
  }
  
  </script><html style="overflow-x: hidden;"><head><title>GEFS Online - Free Flight Simulator</title>
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" />
<meta http-equiv="content-type" content="text/html; charset=utf-8"><meta name="keywords" content="flight simulator, game, free, online, multiplayer, google earth, simulation, joystick, aviation, helicopter, hot air balloon, aircraft, pilot"><meta name="description" content="A free, online, multiplayer flight simulator based on Google Earth."><link rel="shortcut icon" href="favicon.ico"><script type="text/javascript" src="http://www.google-analytics.com/ga.js" obfuscation="none"></script><script id="gekey" src="http://www.google.com/jsapi?key=ABQIAAAAxGP02Znit2t6IlHB2JFcixRjhlbp8b0hzfpNZzrbcu9nH1Ee_xQ_JsMHSfN13E_16aOLidvJQf5J2A" obfuscation="none"></script><!-- Data --><!-- 3rd party Libs --><!-- Common libs --><!-- Sim --><script type="text/javascript">ges.PRODUCTION = true;ges.killCache = '1357828012';</script><script type="text/javascript" src="js/gefs.js?killcache=1357828012"></script><link rel="stylesheet" type="text/css" href="style/gefs.css?kc=123" media="screen"/><script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-2996341-8']);
  _gaq.push(['_trackPageview']);
  
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();</script>
  
  <!-- begin Autopilot++ changes -->
  <script>
  ges.communityAircraftMap = {};
  /*
  ges.PRODUCTION = false;
  $(function () {
    $('<li>').append(
      $('<a>')
        .text('Bombardier Q400')
        .prop('href', '#')
        .mouseup(function () {
          ges.aircraft.change('q400');
        })
    ).appendTo($('.dropdown-menu').eq(2).empty());
  });
  */
  </script>
  <script src="autopilot/require.js" data-main="autopilot/main.js"></script>
  <!-- end Autopilot++ changes -->
  
  </head><body class="gefs loggedout" style="overflow: hidden;">
  
	<button class="gefs-focus-target"></button>
	<div class="soundplayerContainer" style="position: absolute; width: 0px; height: 0px; left: -1000px; top: -1000px;"></div>
	
    <div class="gefs-ui-top">
        <a class="gefs-expand-vert btn btn-mini"><i class="icon-chevron-down"></i></a>
        <table class="gefs-ui-layoutTable" cellpadding="0"><tr><td style="width: 100px; height: 100%;">
                    <div class="gefs-player-count">
            	           <script>
      $('body').removeClass('loggedout').removeClass('loggedin');
      $('body').addClass('loggedout');
    </script>    
    <div class="gefs-auth">
        <form>
      You are not logged-in <a href="index.php?openIdLogin" class="gefs-google-sign-in"></a>
    </form>
      <!--
      <form method="post" action="/backend/accounts/auth.php" class="gefs-f-ajaxForm form-inline" data-target=".gefs-auth">     
        <input type="hidden" name="action" value="login" />
        <input name="email" type="text" class="input-small gefs-stopPropagation" placeholder="email"/>
        <input name="password" type="password" class="input-small gefs-stopPropagation" placeholder="password"/>
        <label class="checkbox"><input type="checkbox" name="rememberme"/>Remember me</label>
        <button type="submit" class="btn btn-info">Login</button>
      </form>
      <a href="/backend/accounts/account.php" class="gefs-signup-button gefs-f-ajaxLink" data-target=".gefs-account-placeholder">Signup</a>
      -->
      </div>
<script type="text/javascript">
  var ges = window.ges || {};

  ges.multiplayerHost = 'http://net.gefs-online.com:8080';

  ges.userAccount = {
    'id': '',
    'sessionId': '6568rk6mkur5m1rk25lrcubuq1',
    'muteArray': []
  };
  
  ges.userAccount.muteList = {};
  for (i = 0, l = ges.userAccount.muteArray.length; i < l; i++) {
    ges.userAccount.muteList[ges.userAccount.muteArray[i]] = 1;   
  }
  
  </script><div class="count"></div>
                    </div>
                </td>
                <td>
                    <div class="gefs-chat-section gefs-is-logged-in">
                        <div class="gefs-chat-user-popup">
                            Pilot: <b class="gefs-user-callsign"></b>
                            <button class="gefs-cancel btn">Cancel</button>
                            <button class="gefs-ignore-user btn btn-inverse"><i class="icon-ban-circle icon-white"></i> Block</button>
                        </div>
                        <div class="gefs-chat-messages"></div>
                    </div>
                </td>
                <td style="width: 500px;">
                    <div class="setup-section" id="googleAds"><script type="text/javascript"><!--
google_ad_client = "ca-pub-1808592532341984";
/* GEFS One line */
google_ad_slot = "1820948244";
google_ad_width = 468;
google_ad_height = 15;
//-->
</script><script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script></div>
                </td>
            </tr></table></div>
  
  <!-- Left UI -->
  <div class="gefs-ui-left">
    
    <div class="gefs-debug">
      <div class="gefs-debugFrame">
        <label>Part name<input type="text" class="debugPointName"></label>
        <label>Collision point index<input title="collision point index" style="width: 20px;" class="debugCollisionPointIndex"></label>
        <label class="checkbox">Force Source Point<input type="checkbox" class="debugShowForceSource" title="force source point"></label>
        <label class="checkbox">Force Direction<input type="checkbox" class="debugShowForceDirection" title="Force direction"></label>
        <label class="checkbox">Local Position<input type="checkbox" class="debugShowLocalPosition" title="Local position"></label>
        <button class="btn btn-warning" onclick="ges.killCache = new Date().getTime(); ges.debugResetAircraft = true;">Clear cache</button>
        <button class="btn" onclick="ges.aircraft.change(ges.aircraft.name, /* justReload */ ges.debugResetAircraft);">Reload aircraft</button>
        <div class="gefs-debugWatch"></div>
        <div class="gefs-debugLog"></div>
      </div>
    </div>
    
    <div class="gefs-preferences">
      <div class="form-horizontal">
    <ul class="nav nav-tabs">
        <li class="active">
            <a href="#tabs-controls" data-toggle="tab">Controls</a>
        </li>
        <li>
            <a href="#tabs-simulation" data-toggle="tab">Simulation</a>
        </li>
        <li>
            <a href="#tabs-weather" data-toggle="tab">Weather</a>
        </li>
        <li>
            <a href="#tabs-about" data-toggle="tab">Help</a>
        </li>
        <li>
            <a href="#tabs-credits" data-toggle="tab">Credits</a>
        </li>
        <li>
            <a href="#tabs-debug" data-toggle="tab">Debug info</a>
        </li>
        <li style="float: right; padding: 9px;">
            <button class="close" onclick="ges.togglePreferencesPanel();">
                &times;
            </button>
        </li>
    </ul>

    <!--
    <div  class="gefs-tab-content" id="tabs-aircraft">
    </div>
    -->
    <div class="tab-content">

        <div class="tab-pane active gefs-tab-content tabbable tabs-left" id="tabs-controls">
            <!-- Controls -->

            <span class="help-inline">Select a control device and configure it.</span>
            <div class="btn-group nav" data-toggle="buttons-radio">
                <button href="#control-keyboard" data-toggle="tab" gespref="ges.preferences.controlMode" matchvalue="keyboard" update="controls.setMode();" type="button" data-type="radio-button" class="btn">
                    Keyboard [K]
                </button>
                <button href="#control-mouse" data-toggle="tab" gespref="ges.preferences.controlMode" matchvalue="mouse" update="controls.setMode();" type="button" data-type="radio-button" class="btn">
                    Mouse [M]
                </button>
                <button href="#control-joystick"  data-toggle="tab" gespref="ges.preferences.controlMode" matchvalue="joystick" update="controls.setMode();" type="button" data-type="radio-button" class="btn">
                    Joystick [J]
                </button>
            </div>

            <div class="tab-content">
                <div class="tab-pane active" id="control-keyboard">
                    <fieldset>
                        <legend>
                            Settings
                        </legend>

                        <label class="checkbox" title="Mixes the rudder with the ailerons input">
                            <input type="checkbox" gespref="ges.preferences.keyboard.mixYawRoll" update="controls.setMode();" />
                            Mix Roll/Yaw </label>

                        <div title="Sets how much rudder is mixed from the ailerons input" class="slider span2" type="slider" gespref="ges.preferences.keyboard.mixYawRollQuantity" update="controls.setMode();" value="0" min="0.1" max="4" precision="1">
                            <div class="slider-rail">
                                <div class="slider-selection">
                                    <div class="slider-grippy">
                                        <input class="slider-input"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label>Roll/Yaw Mix Ratio</label>

                        <div title="Sets how quickly the input responds" class="slider span2" type="slider" gespref="ges.preferences.keyboard.sensitivity" update="controls.setMode();" value="0" min="0.1" max="4" precision="1">
                            <div class="slider-rail">
                                <div class="slider-selection">
                                    <div class="slider-grippy">
                                        <input class="slider-input"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label>Sensitivity</label>

                        <!--
                        <br/>Exponential: <div type="slider" max="2" step="0.1" class="gefs-ui-slider" gespref="ges.preferences.keyboard.exponential" ></div>
                        -->
                    </fieldset>
                    <fieldset>
                        <legend>
                            Keys
                        </legend>
                        <div class="gefs-keyboard-keys-container">
                            <!-- pouplated by javascript - preferences.js-->
                        </div>
                    </fieldset>
                </div>

                <div class="tab-pane" id="control-mouse">
                    <fieldset>
                        <legend>
                            Settings
                        </legend>

                        <label class="checkbox" title="Mixes the rudder with the ailerons input">
                            <input type="checkbox" gespref="ges.preferences.mouse.mixYawRoll" update="controls.setMode();"/>
                            Mix Roll/Yaw </label>

                        <div title="Sets how much rudder is mixed from the ailerons input" class="slider span2" type="slider" gespref="ges.preferences.mouse.mixYawRollQuantity" update="controls.setMode();" value="0" min="0.1" max="4" precision="1">
                            <div class="slider-rail">
                                <div class="slider-selection">
                                    <div class="slider-grippy">
                                        <input class="slider-input"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label>Roll/Yaw Mix Ratio</label>

                        <div title="Sets how quickly the input responds" class="slider span2" type="slider" gespref="ges.preferences.mouse.sensitivity" update="controls.setMode();" value="0" min="0.1" max="2" precision="1">
                            <div class="slider-rail">
                                <div class="slider-selection">
                                    <div class="slider-grippy">
                                        <input class="slider-input"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label>Sensitivity</label>

                        <div title="For hight value, input will be gentle near the center and fast at the extremes" class="slider span2" type="slider" gespref="ges.preferences.mouse.exponential" update="controls.setMode();" value="0" min="0.1" max="2" precision="1">
                            <div class="slider-rail">
                                <div class="slider-selection">
                                    <div class="slider-grippy">
                                        <input class="slider-input"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label>Exponential</label>

                    </fieldset>
                </div>

                <div class="tab-pane" id="control-joystick">

                    <div class="gefs-preferences-joystick-status">
                        <div class="alert alert-error">
                            <b style="color: red;">No joystick detected:</b> please make sure you <a href="index.php#joystick" target="_blank" />installed the extension</a> and verify your joystick is plugged in properly.
                            <button class="btn primary" onclick="ges.preferencesTestJoystick();">
                                Test again
                            </button>
                        </div>
                        <div class="alert alert-success"></div>
                    </div>

                    <fieldset>
                        <legend>
                            Settings
                        </legend>
                        <label class="checkbox" title="Mixes the rudder with the ailerons input">
                            <input type="checkbox" gespref="ges.preferences.joystick.mixYawRoll" update="controls.setMode();" />
                            Mix Roll/Yaw </label>

                        <div title="Sets how much rudder is mixed from the ailerons input" class="slider span2" type="slider" gespref="ges.preferences.joystick.mixYawRollQuantity" update="controls.setMode();" value="0" min="0.1" max="4" precision="1">
                            <div class="slider-rail"/>
                            <div class="slider-selection">
                                <div class="slider-grippy">
                                    <input class="slider-input"/>
                                </div>
                            </div>
                        </div>
                </div>
                <label>Roll/Yaw Mix Ratio</label>

                <div title="Sets how quickly the input responds" class="slider span2" type="slider" gespref="ges.preferences.joystick.sensitivity" update="controls.setMode();" value="0" min="0.1" max="2" precision="1">
                    <div class="slider-rail"/>
                    <div class="slider-selection">
                        <div class="slider-grippy">
                            <input class="slider-input"/>
                        </div>
                    </div>
                </div>
            </div>
            <label>Sensitivity</label>

            <div title="For hight value, input will be gentle near the center and fast at the extremes" class="slider span2" type="slider" gespref="ges.preferences.joystick.exponential" update="controls.setMode();" value="0" min="0.1" max="2" precision="1">
                <div class="slider-rail"/>
                <div class="slider-selection">
                    <div class="slider-grippy">
                        <input class="slider-input"/>
                    </div>
                </div>
            </div>
        </div>
        <label>Exponential</label>

        </fieldset>
        <fieldset>
            <legend>
                Axis
            </legend>
            <div class="gefs-preferences-comment">
                Move the joystick to check activity
            </div>
            <div class="label-input">
                <label>Pitch</label>
                <div class="input-append">
                    <select class="span2" gespref="ges.preferences.joystick.axis.pitch" style="float: left;">
                        <option value="none">None</option>
                        <option value="x">X Axis</option>
                        <option value="y">Y Axis</option>
                        <option value="z">Z Axis</option>
                        <option value="r">R Axis</option>
                    </select>
                    <div class="add-on progress" axis="pitch" style="float: left;">
                        <div class="bar"></div>
                    </div>
                    <label class="checkbox" title="Reverse axis" style="margin: 5px;">
                        <input type="checkbox" gespref="ges.preferences.joystick.multiplier.pitch" update="controls.setMode();"/>                            
                        Reverse
                    </label>                     
                </div>
            </div>
            <div class="label-input">
                <label>Roll</label>
                <div class="input-append">
                    <select class="span2" gespref="ges.preferences.joystick.axis.roll" style="float: left;">
                        <option value="none">None</option>
                        <option value="x">X Axis</option>
                        <option value="y">Y Axis</option>
                        <option value="z">Z Axis</option>
                        <option value="r">R Axis</option>
                    </select>
                    <div class="add-on progress" axis="roll" style="float: left;">
                        <div class="bar"></div>
                    </div>
                    <label class="checkbox" title="Reverse axis" style="margin: 5px;">
                        <input type="checkbox" gespref="ges.preferences.joystick.multiplier.roll" update="controls.setMode();"/>
                        Reverse
                    </label>  
                </div>
            </div>

            <div class="label-input">
                <label>Yaw</label>
                <div class="input-append">
                    <select class="span2" gespref="ges.preferences.joystick.axis.yaw" style="float: left;">
                        <option value="none">None</option>
                        <option value="x">X Axis</option>
                        <option value="y">Y Axis</option>
                        <option value="z">Z Axis</option>
                        <option value="r">R Axis</option>
                    </select>
                    <div class="add-on progress" axis="yaw" style="float: left;">
                        <div class="bar"></div>
                    </div>
                    <label class="checkbox" title="Reverse axis" style="margin: 5px;">
                        <input type="checkbox" gespref="ges.preferences.joystick.multiplier.yaw" update="controls.setMode();"/>
                        Reverse
                    </label>
                </div>
                </label>
            </div>

            <div class="label-input">
                <label>Throttle</label>
                <div class="input-append">
                    <select class="span2" gespref="ges.preferences.joystick.axis.throttle" style="float: left;">
                        <option value="none">None</option>
                        <option value="x">X Axis</option>
                        <option value="y">Y Axis</option>
                        <option value="z">Z Axis</option>
                        <option value="r">R Axis</option>
                    </select>
                    <div class="add-on progress" axis="throttle" style="float: left;">
                        <div class="bar"></div>
                    </div>
                    <label class="checkbox" title="Reverse axis" style="margin: 5px;">
                        <input type="checkbox" gespref="ges.preferences.joystick.multiplier.throttle" update="controls.setMode();"/>
                        Reverse
                    </label>                     
                </div>
            </div>

        </fieldset>
        <fieldset>
            <legend>
                Buttons
            </legend>
            <div class="gefs-preferences-comment">
                Press joystick buttons to check activity
            </div>
            <div class="gefs-joystick-button-container">
                <!-- Populated by javascript - preferences.js -->
            </div>
        </fieldset>
    </div>
</div>
</div>

<div class="tab-pane gefs-tab-content" id="tabs-simulation">
    <!-- Simulation -->
    <fieldset>
        <legend>
            General
        </legend>
        <label class="checkbox">
            <input type="checkbox" gespref="ges.preferences.crashDetection" />
            Detect crashes </label>

        <label class="checkbox">             <input type="checkbox" gespref="ges.preferences.chat" disabled="true"/>
            Enable chat
            <br/>
            <i>You must be logged in to use the chat</i>  </label>

        <label class="checkbox">
            <input type="checkbox" gespref="ges.preferences.multiplayer" update="if (this.checked) {multiplayer.start();} else {multiplayer.stop();};" />
            Enable multiplayer </label>
    </fieldset>
    <fieldset>
        <legend>
            Linking
        </legend>
        Generate a link to the current flight (location and aircraft)
        <button class="btn" onclick="ges.getLink();" title="Get a URL to the current flight and location">
            Get link
        </button>
        <div class="gefs-linkOutput"></div>
    </fieldset>
    <fieldset>
        <legend>
            Multi-monitor (Experimental)
        </legend>
        <button class="btn" onclick="camera.openSlaveWindow(-1);" title="Extend screen to the left">
            Open left screen
        </button>
        <button class="btn" onclick="camera.openSlaveWindow(1);" title="Extend screen to the right">
            Open right screen
        </button>
    </fieldset>
</div>

<div class="tab-pane gefs-tab-content" id="tabs-weather">
    <!-- Weather -->
    <fieldset>
        <legend>
            Time of the day
        </legend>
        <label> Enable time slider:
            <input type="checkbox" gespref="ges.preferences.weather.sun" update="weather.sun(this.checked);" />
        </label>
    </fieldset>
    <fieldset>
        <legend>
            Clouds
        </legend>
        <label>show low altitude clouds:
            <input type="checkbox" gespref="ges.preferences.weather.clouds" update="if (this.checked) {weather.showClouds();} else {weather.hideClouds();};" />
        </label>
        <label>Show Real-time cloud cover:
            <input type="checkbox" gespref="ges.preferences.weather.cloudCover" update="if (this.checked) {weather.showCloudCover();} else {weather.hideCloudCover();};"/>
        </label>
    </fieldset>
    <fieldset>
        <legend>
            Wind
        </legend>
        <label>Wind blows:
            <input type="checkbox" gespref="ges.preferences.weather.windActive" update="weather.refresh();" />
        </label>
        <fieldset style="clear: left;">
            <legend>
                Customize:
            </legend>
            <label>Custom wind override:
                <input type="checkbox" gespref="ges.preferences.weather.customWindActive" update="weather.refresh();" />
            </label>

            <div>
                Speed (kts):
                <div title="" class="slider span2" type="slider" gespref="ges.preferences.weather.windSpeed" value="0" min="0" max="60" precision="0" update="if (ges.preferences.weather.customWindActive) {weather.refresh();}">
                    <div class="slider-rail">
                        <div class="slider-selection">
                            <div class="slider-grippy">
                                <input class="slider-input"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                Direction (degrees):
                <div title="" class="slider span2" type="slider" gespref="ges.preferences.weather.windDirection" value="0" min="0" max="360" precision="0" update="if (ges.preferences.weather.customWindActive) {weather.refresh();}">
                    <div class="slider-rail">
                        <div class="slider-selection">
                            <div class="slider-grippy">
                                <input class="slider-input"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </fieldset>
        <label>Wind gusts and direction change:
            <input type="checkbox" gespref="ges.preferences.weather.randomizeWind" />
        </label>
    </fieldset>
</div>

<div class="tab-pane gefs-tab-content" id="tabs-about">
    <iframe src="html/static/about-frame.php" frameborder="no" class="gefs-preference-scrollarea"></iframe>
</div>
<div class="tab-pane gefs-tab-content" id="tabs-credits">
    <iframe src="html/static/credits-frame.php" frameborder="no" class="gefs-preference-scrollarea"></iframe>
</div>
<div class="tab-pane gefs-tab-debug" id="tabs-debug">
    <fieldset>
        <legend>
            Debug Info
        </legend>
        <textarea class="ges-debug-info"></textarea>
    </fieldset>
</div>
<div style="clear: both;"></div>
</div>

<div class="form-actions">
    <button class="btn btn-warning" style="float: left; margin-left: 10px;" onclick="ges.resetPreferences();">
        Reset preferences to default
    </button>
    <button class="btn" style="float: right;" onclick="ges.cancelPreferencesPanel();">
        Cancel
    </button>
    <button class="btn btn-primary" style="float: right;" onclick="ges.savePreferencesPanel();">
        Save and close
    </button>
</div>
</div></div>
    <div class="gefs-map">
      <a class="gefs-expand-horiz btn btn-mini"><i class="icon-chevron-right"></i></a>
      <div class="gefs-map-viewport"></div>
      <div class="gefs-autopilot gefs-stopPropagation">
          <h6>Autopilot</h6>
          <button class="btn btn-mini gefs-autopilot-toggle" style="margin-bottom: 5px; width: 100%;" onclick="controls.autopilot.toggle();" title autopilot on>Disengaged</button>
            <div class="input-prepend input-append">
              <span class="add-on">Alt.</span>
              <input type="text" class="gefs-autopilot-altitude span2" onchange="controls.autopilot.setAltitude(this.value);"><span class="add-on">ft.</span>
            </div>          
            <div class="input-prepend input-append">
              <span class="add-on">Hdg.</span>
              <input type="text" class="gefs-autopilot-heading span2" onchange="controls.autopilot.setHeading(this.value);"><span class="add-on">deg.</span>
            </div>
            <div class="input-prepend input-append">
              <span class="add-on">Spd.</span>
              <input type="text" class="gefs-autopilot-kias span2" onchange="controls.autopilot.setKias(this.value);"><span class="add-on">Kts.</span>
            </div>            
      </div>
    </div>
  </div>
  
  <!-- Plugin -->
	<div id="map3d" class="map3d"></div>

	<div class="gefs-ui">
		
        <table class="gefs-ui-layoutTable" cellpadding="0"><tr><td class="gefs-f-recordPlayer" style="width: 365px;">
		
				    <div class="setup-section">
				      <button class="btn btn-info" onclick="flight.recorder.exitPlayback();" title="Exit record player">Exit player</button>		      
			        </div>

					<!-- Player controls -->
					<div class="setup-section">
		
		                <!-- In record player camera selector -->
		                <div class="btn-group dropup">
		                    <button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Camera <span class="caret"></span></button>
		                    <ul class="dropdown-menu"><!-- dropdown menu links --><li class="dropdown-submenu gefs-extra-views">
		                            <a tabindex="-1" href="#">Extra views</a>
		                            <ul class="dropdown-menu gefs-extra-views-holder"><!-- to be filled from aircraft definition --></ul></li>
		                        <li class="divider">
		                        <li><a href="#" onmouseup="camera.set(0);">Follow cam</a></li>
		                        <li><a href="#" onmouseup="camera.set(1);">Cockpit cam</a></li>
		                        <li><a href="#" onmouseup="camera.set(2);">Cockpit-less cam</a></li>
		                        <li><a href="#" onmouseup="camera.set(3);">Chase cam</a></li>
		                        <li><a href="#" onmouseup="camera.set(4);">Free cam</a></li>
		                        <iframe frame-border="no" class="gefs-shim-iframe"></iframe>
		                    </ul></div>
		
		                <div class="btn-group">
		    				<button class="btn" onclick="flight.recorder.setStep(0);" title="Begining"><i class="icon-fast-backward"></i></button>
		    				<button class="btn" onclick="flight.recorder.startPlayback();" title="Start playback"><i class="icon-play"></i></button>
		    				<button class="gefs-button-pause btn" onclick="ges.togglePause();" title="Pause/Unpause playback [P]"><i class="icon-pause"></i></button>
		    				<button class="btn" onclick="flight.recorder.setStep(100000);" title="End"><i class="icon-fast-forward"></i></button>
						</div>				
					</div>

                </td>
                <td class="gefs-f-recordPlayer">
                    
					<!-- player's slider -->
					<div class="setup-section" style="width: 100%; position: relative; box-sizing: border-box;">
		    	        <div class="slider gefs-recordPlayer-slider" type="slider" value="0" min="0" precision="0" style="height: 10px;">
		    	          <div class="slider-rail">
		    	            <div class="slider-selection">
		    	              <div class="slider-grippy"><input class="slider-input"></div>
		    	            </div>
		    	          </div>  
		    	        </div>
		            </div>		            

                </td>
                <td class="gefs-f-standard">
        
                    <!-- Standard controls -->
        			<div class="setup-section" style="margin-left: 2px;">
        				
        				<!-- Aircraft selector -->
        				<div class="btn-group dropup">
        				  	<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Aircraft <span class="caret"></span></button>
        				  	<ul class="dropdown-menu">        						<li><a href="#" onmouseup="ges.aircraft.change('sopwith');">Sopwith Camel F.1</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('cub');">Piper J-3 Cub</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('sportstar');">Evektor Sportstar</a></li>		
        						<li><a href="#" onmouseup="ges.aircraft.change('alphajet');">Dassault-Dornier Alpha Jet</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('dc3');">Douglas DC-3</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('hughes');">Hughes 269a/TH-55 Osage</a></li>					
        						<li><a href="#" onmouseup="ges.aircraft.change('tom');">Major Tom (hot air balloon)</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('md11');">McDonnell Douglas MD-11</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('su35');">SU-35</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('a380');">Airbus A380</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('concorde');">Concorde</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('zlin');">Zlin Z-50</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('cessna');">Cessna 152</a></li>						
        						<li><a href="#" onmouseup="ges.aircraft.change('goat');">Goat Airchair</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('para');">Paraglider</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('jantar');">szd-48-3 Jantar</a></li>
        						<li><a href="#" onmouseup="ges.aircraft.change('AN140');">Antonov An-140</a></li>
        						<iframe frame-border="no" class="gefs-shim-iframe"></iframe>
        					</ul></div>
        				
        				<!-- Debug button -->
        				<!-- Location selector --><div class="btn-group dropup">
        				  	<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Location <span class="caret"></span></button>
        				  	<ul class="dropdown-menu"><li class="dropdown-submenu">
        	                    	<a tabindex="-1" href="#">Ridge Soaring/Gliding</a>
        	                    	<ul class="dropdown-menu"><li><a href="#" onmouseup="ges.windOverride = true; ges.preferences.weather.windSpeed = 14; ges.preferences.weather.windDirection = 277; ges.flyTo([32.89034750891853,-117.25156658170516,0,-85]);">Torrey Pines Gliderport (Soaring)</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = true; ges.preferences.weather.windSpeed = 16; ges.preferences.weather.windDirection = 277; ges.flyTo([44.58291179132744,-1.2190110965731453,0,-82]);">Dune du Pyla (Soaring)</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([42.99043614854522,-0.19668640145259153,1400,134, true]);">Argelès-Gazost, Val d'Azun (Paragliding)</a></li>
        								<iframe frame-border="no" class="gefs-shim-iframe"></iframe>
        							</ul></li>
        						
        						<!-- Gate -->
        						<li class="dropdown-submenu">
        	                    	<a tabindex="-1" href="#">At The Gate</a>
        	                    	<ul class="dropdown-menu"><li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([33.43710857041375,-111.999915329145,0,90.6]);">Phoenix Skyharbor Airport - Terminal 4 - Gate A6</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([25.79373466921487,-80.28040649955423,0,153]);">Miami International Airport - Gate F5</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([35.5500,139.7908048837465,0,-121.07]);">Tokyo (Haneda) Int'l - Gate 65</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([47.460649437789215,8.552392504958451,0, 6.15]);">Zurich Int'l Airport - Gate E58</a></li>
        								<iframe frame-border="no" class="gefs-shim-iframe"></iframe>
        							</ul></li>
        						
        						<li class="dropdown-submenu">
        	                    	<a tabindex="-1" href="#">Approaches</a>
        	                    	<ul class="dropdown-menu"><li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([36.145,-5.551,800,90, true]);">Gibraltar Int'l</a></li>
                                        <li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([37.807416414832694,-122.6137032378986,309,173.32]);">USS John C. Stennis (Carrier)</a></li>
        	                    	    <li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([24.55734481134812,-81.71068081353695,500,-91.41]);">Key West Int'l.</a></li>
        	                    	    <li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([4.094025150067297,73.53077099503867,301,0.01]);">Malé</a></li>
        	                    	    <li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([35.83654015054112,-82.30353231586423,600,-42.5]);">Mountain Air</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([45.43225365746484,6.683131212012103,1000,-134]);">Courchevel Altiport</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([18.034682701324222,-63.15433542979288,350,82]);">Princess Juliana Airport, Saint Maarten</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([32.73121515773958,-16.735523534674982,317,-134]);">Santa Catarina Airport (Funchal), Madeira</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([17.904250931639233,-62.85546697796044,150,87]);">Saint Barthélemy Airport</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([43.71957166711304,7.303216893528995,450,-135.72]);">Aéroport Nice Côte d'Azur</a></li>
        								<iframe frame-border="no" class="gefs-shim-iframe"></iframe>
        							</ul></li>
        											
        						<li class="dropdown-submenu">
        	                    	<a tabindex="-1" href="#">On Runway</a>
        	                    	<ul class="dropdown-menu"><li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([42.36021520436057,-70.98767662157663,0,-103.54]);">Logan Int'l (Boston) - 27</a></li>        	                    	    
        	                    	    <li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([25.800717256450998,-80.30116643603567,0,87.65]);">Miami Int'l - 8R</a></li>
        	                    	    <li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([43.66555302435758,7.228367855065596,0,-135]);">Aéroport Nice Côte d'Azur - 22L</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([37.78009384234325,-122.60911495155936,0,172]);">USS John C. Stennis (Carrier)</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([33.93726741762918,-118.38364975124578,0,-96.50347129433592]);">Los Angeles Int'l, USA - 25L</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([43.67416610318312,10.384369181910223,0,36.54]);">Pisa - Italy - 04R</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([53.33191343454627,-2.3107668633750715,0,51.43]);">Manchester Int'l - UK - 05</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([25.235998236262787,55.394770414276515,0,-61.49]);">Dubai Int'l - UAE - 30L</a></li>
        								<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([44.838118548285536,-0.7018235748525906,0,226]);">Bordeaux - France</a></li>
        								<iframe frame-border="no" class="gefs-shim-iframe"></iframe>
        							</ul></li>
        				
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([45.938149486108856,6.892803255304612,1500,37.89311560373897]);">Chamonix - Alps - France</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([37.76577100453262,-122.36941785026704,455,-51.942644559501176]);">San Francisco - USA</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([36.110353463200575,-113.24040648366983,1288,-140.62100383790101]);">Grand Canyon - USA</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([-33.84374921548868,151.25052911803596,302,-112.85597028071786]);">Sydney - Australia</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([-25.365600382613092,131.06309762760762,640,-51.22556535133523]);">Uluru - Australia</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([37.969320063220124,23.706062632829592,290,95.18337970067272]);">Acropolis - Athens - Greece</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([27.925300487281817,86.84356489460163,3019,48.38746194814831]);">Mount Everest - Nepal</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([47.605820095333414,10.716154924389544,1077,153.4510132877216]);">Neuschwanstein Castle - Germany</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([43.76783434260276,11.37363711588644,863,-95.0858221868535]);">Florence - Tuscany - Italy</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([32.94077853983021,0.14683667726083313,1200,115.47430369072288]);">Sahara - Algeria</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([-14.81065560936189,-74.97137062648335,1179,-56.668584418305656]);">Nazca - Peru</a></li>
        						<li><a href="#" onmouseup="ges.windOverride = false; ges.flyTo([52.34043382703594,4.900905358384406,325,4.323532809932645]);">Amsterdam - Netherlands</a></li>
        						
        						<li class="divider">
        						<li>						
        							<form class="gefs-locationForm">
        								<div class="input-append">
        					              <input type="text" class="span3 address-input" id="address" value="Type destination" alt="Type destination"><button class="btn" type="submit">Go</button>
        					            </div>
        							</form>
        						</li>
                          		<iframe frame-border="no" class="gefs-shim-iframe"></iframe>
        			  		</ul></div>
        
        				<!-- Camera selector -->				
        				<div class="btn-group dropup">
        				  	<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Camera <span class="caret"></span></button>
        				  	<ul class="dropdown-menu"><!-- dropdown menu links --><li class="dropdown-submenu gefs-extra-views">
        	                    	<a tabindex="-1" href="#">Extra views</a>
        	                    	<ul class="dropdown-menu gefs-extra-views-holder"><!-- to be filled from aircraft definition --></ul></li>
                          		<li class="divider">
                          		<li><a href="#" onmouseup="camera.set(0);">Follow cam</a></li>
                          		<li><a href="#" onmouseup="camera.set(1);">Cockpit cam</a></li>
                          		<li><a href="#" onmouseup="camera.set(2);">Cockpit-less cam</a></li>
                          		<li><a href="#" onmouseup="camera.set(3);">Chase cam</a></li>
                          		<li><a href="#" onmouseup="camera.set(4);">Free cam</a></li>
                          		<iframe frame-border="no" class="gefs-shim-iframe"></iframe>
        			  		</ul></div>
        			</div>
        
        			<!-- Options and map -->			
        			<div class="setup-section">
        				<button class="btn" onclick="ges.togglePreferencesPanel();" title="Open the settings/options panel [O]">Options <i class="icon-wrench"></i></button>
        				<button class="btn" onclick="ui.toggleMap();" title="Open the navigation panel [N]">Nav <i class="icon-globe"></i></button>
        			</div>
        			
        			<!-- Pause, mute, reset, playback -->
        			<div class="setup-section btn-group">
        				<button class="gefs-button-pause btn" onclick="ges.togglePause();" title="Pause/Unpause the simulation [P]"><i class="icon-pause"></i></button>
        				<button class="gefs-button-mute btn" onclick="audio.toggleMute();" title="Mute/Unmute sound [S]"><i class="icon-volume-off"></i></button>
        				<button class="btn" onclick="ges.resetFlight();" title="Reset the flight [R]"><i class="icon-refresh"></i></button>
        				<button class="btn" onclick="flight.recorder.enterPlayback();" title="Watch recorded flight"><i class="icon-film"></i></button>
        			</div>
        			
        			<!-- Chat -->
        			<div class="setup-section gefs-is-logged-in">
        				<button class="gefs-button-chat btn" title="Type a chat message [T]">Talk <i class="icon-align-left"></i></button><form class="gefs-chatForm" style="display: none;"><input type="text" size="30" maxlength="140" class="gefs-chat-input gefs-stopPropagation"><button class="gefs-chat-send-button btn">Send</button></form>
        			</div>

                </td>                                      
            </tr></table></div>
</body></html>
