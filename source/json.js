/** @license
 * RequireJS plugin for loading JSON files
 * - depends on Text plugin and it was HEAVILY "inspired" by it as well.
 * Author: Miller Medeiros (modifications by Karl Cheng)
 * Based on version 0.4.0 (2014/04/10)
 * Released under the MIT license
 */
'use strict';

define([ 'text' ], function (text) {
  var buildMap = Object.create(null);

  function load(name, req, onLoad, config) {
    if (config.isBuild && config.inlineJSON === false || req.toUrl(name).indexOf('empty:') === 0) {
      onLoad(null);
    }
    else text.get(req.toUrl(name), callback, onLoad.error, { accept: 'application/json' });

    function callback(data) {
      if (config.isBuild) {
        buildMap[name] = data;
        onLoad(data);
        return;
      }

      try {
        onLoad(JSON.parse(data));
      } catch (e) {
        onLoad.error(e);
      }
    }
  }

  // Write method based on RequireJS official text plugin by James Burke.
  // https://github.com/jrburke/requirejs/blob/master/text.js
  function write(pluginName, moduleName, write) {
    var content = buildMap[moduleName];
    if (content !== undefined) {
      // All JSON is well-formed JavaScript, except for unescaped \u2028 and \u2029.
      content = content.replace(/u2028/g, '\\u2028').replace(/u2029/g, '\\u2029');

      // define('json!file.json', {"contents":1});
      write('define("' + pluginName + '!' + moduleName + '", ' + content + ');\n');
    }
  }

  return {
    load: load,
    write: write
  };
});
