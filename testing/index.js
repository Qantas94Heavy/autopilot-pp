'use strict';

// jshint node:true
var heads = require('robohydra').heads;
var RoboHydraHeadFilesystem = heads.RoboHydraHeadFilesystem;
var RoboHydraHeadProxy = heads.RoboHydraHeadProxy;
var RoboHydraHead = heads.RoboHydraHead;
var fs = require('fs');
var path = require('path');

exports.getBodyParts = function (conf) {
  return {
    heads: [
      new RoboHydraHeadFilesystem({
        mountPath: '/autopilot',
        documentRoot: 'source'
      }),
      
      new RoboHydraHead({
        path: '/gefs.php',
        handler: function (request, response) {
          response.headers['Content-Type'] = 'text/html';
          
          fs.readFile(path.resolve(__dirname, 'gefs.php'), { encoding: 'utf-8' }, function (err, data) {
            if (err) throw err;
            response.send(data);
          });
        }
      }),

      new RoboHydraHeadProxy({
        mountPath: '/',
        proxyTo: 'http://www.gefs-online.com',
        setHostHeader: true
      })
    ]
  };
};