var head = document.head || document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.src = chrome.extension.getURL("gc-coords_v0.1.js");
script.type = 'application/ecmascript';
script.onload = function () { this.parentNode.removeChild(this); };
if (top === window) head.appendChild(script);
else delete script;