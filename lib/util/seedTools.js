'use strict';

var fs = require('fs');
var tar = require('tar-fs');
var zlib = require('zlib');
var https = require('https');

var seedTools = {};

seedTools.downloadTar = function downloadTar(source, dest, cb) {
    var file = fs.createWriteStream(dest);
    https.get(source, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
};

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
