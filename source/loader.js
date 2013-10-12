var head = document.head || document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.src = chrome.extension.getURL('code.user.js');
script.type = 'application/ecmascript';
script.onload = function () { this.parentNode.removeChild(this); };
top === window ? head.appendChild(script) : script = null;