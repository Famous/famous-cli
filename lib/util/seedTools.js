'use strict';

var fs = require('fs');
var tar = require('tar-fs');
var zlib = require('zlib');
var https = require('https');

var storage = require('../../res/sdk-bundle.js').storage;

var seedTools = {};

/**
 * setHooks
 *
 * Function for setting seed hooks.
 *
 */
seedTools.setHooks = function setHooks(hooks, callback) {
    storage.getProjectMeta(function(error, config) {
        var scripts = config.scripts || {};
        for (var script in hooks) {
            scripts[script] = hooks[script];
        }
        storage.setProjectMeta({scripts: scripts}, callback);
    });
};

/**
 * downloadTar
 *
 * Function for downloading a file.
 *
 */
seedTools.downloadTar = function downloadTar(source, dest, cb) {
    var file = fs.createWriteStream(dest);
    https.get(source, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
};

/**
 * extract
 *
 * Function for extracting a gzipped tarball.
 *
 */
seedTools.extract = function extract(source, dest, cb) {
    fs.createReadStream(source)
        .pipe(zlib.createGunzip())
        .pipe(tar.extract(dest))
        .on('error', function(error) {
            cb(error);
        })
        .on('finish', function() {
            cb(null);
        });
};

module.exports = seedTools;
