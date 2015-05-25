'use strict';

var fs = require('fs-extra');
var https = require('https');
var path = require('path');
var chalk = require('chalk');
var os = require('os');

var seedTools = require('../util/seedTools');

/**
 *
 */
var initProject = function(options, callback) {
    var tempDir = os.tmpdir();

    var tempZipPath = path.join(tempDir, Date.now().toString() + '.tar.gz');
    var tempPath = path.join(tempDir, Date.now().toString());

    var zipPath = 'https://code.famo.us/cli/engine-seed-master.tar.gz';

	if (typeof options === 'string') {
        var name = options;
        var dirPath = path.join(process.cwd(), name);
        
        try {
            var stats = fs.lstatSync(dirPath);
            console.log(chalk.bold.red('Directory name already exists.'));
            process.exit(1);
        }
        catch (e) {
            seedTools.downloadTar(zipPath, tempZipPath, function() {
                seedTools.extract(tempZipPath, tempPath, function(){
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
                seedTools.downloadTar(zipPath, tempZipPath, function() {
                    seedTools.extract(tempZipPath, tempPath, function() {
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

/** **/
module.exports = initProject;

