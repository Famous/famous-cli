'use strict'

var fs = require('fs');
var tar = require('tar');
var zlib = require('zlib');


var extract = function extract(source, dest, cb) {
    fs.createReadStream(source)
        .pipe(zlib.createGunzip())
        .pipe(tar.Extract({ path: dest}))
        .on('error', function(error) { cb(error)})
        .on("end", function() { cb(null)})
};

module.exports = extract;