'use strict';

var fs = require('fs');
var async = require('async');
var file = {};

/**
 * getTotalSizeInBytes
 *
 * Checks the size of files to upload.
 *
 */
file.getTotalSizeInBytes = function getTotalSizeInBytes(filenames, callback) {
    async.map(filenames, fs.stat, function(err, results) {
        if (err) {
            return callback(err, null);
        }
        var total = 0;
        results.forEach(function(current) {
            total += current.size;
        });
        return callback(null, total);
    });
};

module.exports = file;
