'use strict';

var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var os = require('os');

var seedTools = require('../util/seedTools');

/**
 * forkProject
 *
 * Unpacks a tar of a tutorial project in a named subdirectory.
 */
var forkProject = function(options, callback) {
    var tempDir = os.tmpdir();

    var tempZipPath = path.join(tempDir, Date.now().toString() + '.tar.gz');
    var tempPath = path.join(tempDir, Date.now().toString());

    if (typeof options === 'string') {
        var name = options;
        var dirPath = path.join(process.cwd(), name);

        try {
            fs.lstatSync(dirPath);
            console.log(chalk.bold.red('Directory name already exists.'));
            process.exit(1);
        }
        catch (e) {
            var zipPath = 'https://s3-us-west-2.amazonaws.com/code.famo.us/cli/' + name + '.tar.gz';
            seedTools.downloadTar(zipPath, tempZipPath, function() {
                seedTools.extract(tempZipPath, tempPath, function(){
                    fs.copy(path.join(tempPath, name), dirPath, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        if (typeof callback === 'function') {
                            return callback(null);
                        }
                    });
                });
            });
        }
    }
};

/** **/
module.exports = forkProject;

