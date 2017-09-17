'use strict';

// jshint node:true, esversion:6
const heads = require('robohydra').heads;
const RoboHydraHeadFilesystem = heads.RoboHydraHeadFilesystem;
const RoboHydraHeadFilter = heads.RoboHydraHeadFilter;
const RoboHydraHeadProxy = heads.RoboHydraHeadProxy;

const script = `<script data-main="/autopilot/init"
                        src="/autopilot/node_modules/requirejs/require.js"></script>`;

exports.getBodyParts = function () {
  return {
    heads: [
      new RoboHydraHeadFilesystem({
        mountPath: '/autopilot',
        documentRoot: 'source'
      }),

      new RoboHydraHeadFilter({
        path: '/gefs.php*',
        filter: function (buffer) {
          return buffer.toString().replace('</head>', script + '</head>');
        }
      }),

      new RoboHydraHeadProxy({
        mountPath: '/',
        proxyTo: 'http://www.geo-fs.com',
        setHostHeader: true
      })
    ]
  };
};
