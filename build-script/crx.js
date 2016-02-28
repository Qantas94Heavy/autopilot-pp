'use strict';

// jshint esversion:6, node:true
const yazl = require('yazl');
const util = require('util');
const stream = require('stream');
const crypto = require('crypto');

// jshint -W079
const Promise = require('bluebird');
// jshint +W079
const NodeRSA = require('node-rsa');
const streamToArray = require('stream-to-array');
const jsStringEscape = require('js-string-escape');

function createZip(minified, chromeManifest) {
  let zip = new yazl.ZipFile();
  const wrapper = util.format(
    "var d=document;top==this&&(d.head.appendChild(d.createElement('script')).text='%s')",
    jsStringEscape(minified)
  );


  zip.addBuffer(new Buffer(wrapper), 'c.js');
  zip.addBuffer(new Buffer(JSON.stringify(chromeManifest)), 'manifest.json');
  zip.end();
  return zip.outputStream;
}

function getSignature(stream, pem) {
  return new Promise(function (resolve, reject) {
    let sign = crypto.createSign('RSA-SHA1');
    stream.pipe(sign);

    sign.on('finish', function () {
      try {
        resolve(sign.sign(pem));
      } catch (e) {
        reject(e);
      }
    });

    sign.on('error', function (e) {
      this.end();
      reject(e);
    });
  });
}

exports.create = function (minified, chromeManifest, pem) {
  const zipStream = createZip(minified, chromeManifest);
  const gettingSignature = getSignature(zipStream, pem);
  const zipBuffering = streamToArray(zipStream).then(arr => Buffer.concat(arr));

  const key = new NodeRSA(pem);
  const publicKey = key.exportKey('pkcs8-public-der');

  return Promise.join(zipBuffering, gettingSignature, function (buffer, signature) {
    // The Chrome documentation says it's 4-byte aligned, but in reality it isn't.
    const crx = new Buffer(16 + publicKey.length + signature.length + buffer.length);
    // Cr24 magic number
    crx.writeUInt32BE(0x43723234, 0);
    // Version of CRX format (2)
    crx.writeUInt32LE(2, 4);
    // Length of RSA public key in bytes.
    crx.writeUInt32LE(publicKey.length, 8);
    // Length of RSA signature in bytes.
    crx.writeUInt32LE(signature.length, 12);

    publicKey.copy(crx, 16);
    signature.copy(crx, 16 + publicKey.length);
    buffer.copy(crx, 16 + publicKey.length + signature.length);
    return crx;
  });
};
