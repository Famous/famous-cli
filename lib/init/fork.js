'use strict';

var fs = require('fs-extra');
var https = require('https');
var path = require('path');
var chalk = require('chalk');
var tar = require('tar');
var zlib = require('zlib');
var os = require('os');

/**
 *
 */
var forkProject = function(options, callback) {
    var tempDir = os.tmpdir();

    var tempZipPath = path.join(tempDir, Date.now().toString() + '.tar.gz');
    var tempPath = path.join(tempDir, Date.now().toString());

    if (typeof options === 'string') {
        var name = options;
        var dirPath = path.join(process.cwd(), name);
        
        try {
            var stats = fs.lstatSync(dirPath);
            console.log(chalk.bold.red('Directory name already exists.'));
            process.exit(1);
        }
        catch (e) {
            downloadSeed(name, tempZipPath, function() {
                extract(tempZipPath, tempPath, function(){
                    fs.copy(path.join(tempPath, 'engine-seed-master'), dirPath, function (err) {
                        if (err) return console.error(err);
                        if (typeof callback === 'function') {
                            return callback(null);
                        }
                    });
                });
            });
        }
    } else {
        fs.readdir(process.cwd(), function (err, items) {
            if (err) {
                return cb(true);
            }
            if (!items || !items.length) {
                downloadSeed(name, tempZipPath, function() {
                    extract(tempZipPath, tempPath, function() {
                        fs.copy(path.join(tempPath, 'engine-seed-master'), process.cwd(), function(err) {
                            if (err) return console.error(err);
                            if (typeof callback === 'function') {
                                return callback(null);
                            }
                        })
                    });
                });
            } else {
                console.log(chalk.bold.red('Current directory is non empty.'));
                process.exit(1);
            }
        });

    }

    
};

function downloadSeed(name, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = https.get(path.join('https://github.com/famous/', + name ,'/archive/master/tar.gz'), function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
}

function extract(source, dest, cb) {
    fs.createReadStream(source)
        .pipe(zlib.createGunzip())
        .pipe(tar.Extract({ path: dest}))
        .on('error', function(error) { cb(error)})
        .on("end", function() { cb(null)})
}

/** **/
module.exports = forkProject;

