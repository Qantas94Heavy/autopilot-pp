/**
 * Modified version based on the following code:
 * @license text 2.0.15 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/text/LICENSE
 */
'use strict';

/* global require, XMLHttpRequest, define, location, process */
define([ 'module' ], function (module) {
  var xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im;
  var bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im;
  var hasLocation = typeof location !== 'undefined' && location.href;
  var defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, '');
  var defaultHostName = hasLocation && location.hostname;
  var defaultPort = hasLocation && (location.port || undefined);
  var buildMap = Object.create(null);
  var masterConfig = (module.config && module.config()) || {};

  function useDefault(value, defaultValue) {
    return value === undefined || value === '' ? defaultValue : value;
  }

  // Allow for default ports for http and https.
  function isSamePort(protocol1, port1, protocol2, port2) {
    if (port1 === port2) return true;

    if (protocol1 === protocol2) {
      if (protocol1 === 'http') return useDefault(port1, '80') === useDefault(port2, '80');
      if (protocol1 === 'https') return useDefault(port1, '443') === useDefault(port2, '443');
    }

    return false;
  }

  function strip(content) {
    // Strips <?xml ...?> declarations so that external SVG and XML
    // documents can be added to a document without worry. Also, if the string
    // is an HTML document, only the part inside the body tag is returned.
    if (content) {
      content = content.replace(xmlRegExp, '');
      var matches = content.match(bodyRegExp);
      return matches ? matches[1] : content;
    }

    return '';
  }

  function jsEscape(content) {
    return content.replace(/(['\\])/g, '\\$1')
        .replace(/[\f]/g, "\\f")
        .replace(/[\b]/g, "\\b")
        .replace(/[\n]/g, "\\n")
        .replace(/[\t]/g, "\\t")
        .replace(/[\r]/g, "\\r")
        .replace(/[\u2028]/g, "\\u2028")
        .replace(/[\u2029]/g, "\\u2029");
  }

  /**
   * Parses a resource name into its component parts. Resource names
   * look like: module/name.ext!strip, where the !strip part is
   * optional.
   * @param {String} name the resource name
   * @returns {Object} with properties "moduleName", "ext" and "strip"
   * where strip is a boolean.
   */
  function parseName(name) {
    var modName, ext;
    var index = name.lastIndexOf('.');
    var isRelative = name.indexOf('./') === 0 || name.indexOf('../') === 0;

    if (index !== -1 && (!isRelative || index > 1)) {
      modName = name.slice(0, index);
      ext = name.slice(index + 1);
    }
    else modName = name;

    var temp = ext || modName;
    index = temp.indexOf("!");

    var strip = false;
    if (index !== -1) {
      // Pull off the strip arg.
      strip = temp.slice(index + 1) === "strip";
      temp = temp.slice(0, index);

      if (ext) ext = temp;
      else modName = temp;
    }

    return {
      moduleName: modName,
      ext: ext,
      strip: strip
    };
  }

  var text = {
    version: '2.0.15',
    strip: strip,
    jsEscape: jsEscape,
    parseName: parseName,

    createXhr: masterConfig.createXhr || function () {
      return new XMLHttpRequest();
    },

    xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

    /**
     * Is an URL on another domain. Only works for browser use, returns
     * false in non-browser environments. Only used to know if an
     * optimized .js version of a text resource should be loaded
     * instead.
     * @param {String} url
     * @returns {Boolean}
     */
    useXhr: function (url, protocol, hostname, port) {
      var match = text.xdRegExp.exec(url);
      if (!match) return true;

      var uProtocol = match[2];
      var uHostName = match[3];
      uHostName = uHostName.split(':');

      var uPort = uHostName[1];
      uHostName = uHostName[0];

      return (!uProtocol || uProtocol === protocol) &&
             (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
             ((!uPort && !uHostName) || isSamePort(uProtocol, uPort, protocol, port));
    },

    finishLoad: function (name, strip, content, onLoad) {
      if (strip) content = text.strip(content);
      if (masterConfig.isBuild) buildMap[name] = content;
      onLoad(content);
    },

    /**
     * Name has format: some.module.filext!strip
     * The strip part is optional.
     * If strip is present, then that means only get the string contents inside a body tag in an
     * HTML string. For XML/SVG content it means removing the <?xml ...?> declarations so the
     * content can be inserted into the current doc without problems.
     */
    load: function (name, req, onLoad, config) {
      // Do not bother with the work if a build and text will not be inlined.
      if (config && config.isBuild && !config.inlineText) {
        onLoad();
        return;
      }

      masterConfig.isBuild = config && config.isBuild;

      var parsed = text.parseName(name);
      var nonStripName = parsed.moduleName + (parsed.ext ? '.' + parsed.ext : '');
      var url = req.toUrl(nonStripName);
      var useXhr = masterConfig.useXhr || text.useXhr;

      // Do not load if it is an empty: url.
      if (url.indexOf('empty:') === 0) {
        onLoad();
        return;
      }

      // Load the text. Use XHR if possible and in a browser.
      if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
          text.get(url, function (content) {
            text.finishLoad(name, parsed.strip, content, onLoad);
          }, function (err) {
            if (onLoad.error) onLoad.error(err);
          });
      } else {
        // Need to fetch the resource across domains. Assume
        // the resource has been optimized into a JS module. Fetch
        // by the module name + extension, but do not include the
        // !strip part to avoid file system issues.
        req([ nonStripName ], function (content) {
          text.finishLoad(parsed.moduleName + '.' + parsed.ext, parsed.strip, content, onLoad);
        });
      }
    },

    write: function (pluginName, moduleName, write, config) {
      if (!buildMap[moduleName]) return;

      var content = text.jsEscape(buildMap[moduleName]);
      write("define('" + pluginName + '!' + moduleName + "', function () { return '" +
            content + "';});\n");
    },

    writeFile: function (pluginName, moduleName, req, write, config) {
      var parsed = text.parseName(moduleName);
      var extPart = parsed.ext ? '.' + parsed.ext : '';
      var nonStripName = parsed.moduleName + extPart;

      // Use a '.js' file name so that it indicates it is a
      // script that can be loaded across domains.
      var fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

      // Leverage own load() method to load plugin value, but only
      // write out values that do not have the strip argument,
      // to avoid any potential issues with ! in file names.
      text.load(nonStripName, req, function (value) {
        // Use own write() method to construct full module value.
        // But need to create shell that translates writeFile's
        // write() to the right interface.
        function textWrite(contents) {
          return write(fileName, contents);
        }

        textWrite.asModule = function (moduleName, contents) {
          return write.asModule(moduleName, fileName, contents);
        };

        text.write(pluginName, nonStripName, textWrite, config);
      }, config);
    }
  };

  if (masterConfig.env === 'node' || (!masterConfig.env && typeof process !== 'undefined' &&
        process.versions && !!process.versions.node &&
        !process.versions['node-webkit'] && !process.versions['atom-shell'])) {
    // Using special require.nodeRequire, something added by r.js.
    var fs = require.nodeRequire('fs');

    text.get = function (url, callback, errback) {
      try {
        var file = fs.readFileSync(url, 'utf-8');
        // Remove BOM (Byte Mark Order) from utf8 files if it is there.
        if (file[0] === '\uFEFF') file = file.slice(1);
        callback(file);
      } catch (e) {
        if (errback) errback(e);
      }
    };
  } else if (masterConfig.env === 'xhr' || (!masterConfig.env && text.createXhr())) {
    text.get = function (url, callback, errback, headers) {
      var xhr = text.createXhr();
      xhr.open('GET', url, true);

      // Allow plugins direct access to XHR headers.
      if (headers) Object.keys(headers).forEach(function (header) {
        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
      });

      // Allow overrides specified in config.
      if (masterConfig.onXhr) masterConfig.onXhr(xhr, url);

      xhr.addEventListener('readystatechange', function () {
        // Do not explicitly handle errors, those should be
        // visible via console output in the browser.
        if (xhr.readyState === 4) {
          var status = xhr.status || 0;
          if (status > 399 && status < 600) {
            // An HTTP 4xx or 5xx error. Signal an error.
            if (errback) {
              var err = new Error(url + ' HTTP status: ' + status);
              err.xhr = xhr;
              errback(err);
            }
          }
          else callback(xhr.responseText);

          if (masterConfig.onXhrComplete) masterConfig.onXhrComplete(xhr, url);
        }
      });

      xhr.send(null);
    };
  }

  return text;
});
