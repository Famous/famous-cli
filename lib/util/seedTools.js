'use strict'

var fs = require('fs');
var tar = require('tar');
var zlib = require('zlib');
var https = require('https');

var seedTools = {};

seedTools.downloadTar = function downloadTar(source, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = https.get(source, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
};

seedTools.extract = function extract(source, dest, cb) {
    fs.createReadStream(source)
        .pipe(zlib.createGunzip())
        .pipe(tar.Extract({ path: dest}))
        .on('error', function(error) { cb(error)})
        .on("end", function() { cb(null)})
};

module.exports = seedTools;