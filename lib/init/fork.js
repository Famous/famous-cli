'use strict';

var fs = require('fs-extra');
var https = require('https');
var path = require('path');
var chalk = require('chalk');
var os = require('os');

var extract = require('../util/extract');

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
                    fs.copy(path.join(tempPath, name), dirPath, function (err) {
                        if (err) return console.error(err);
                        if (typeof callback === 'function') {
                            return callback(null);
                        }
                    });
                });
            });
        }
    } 
};

function downloadSeed(name, dest, cb) {
    var file = fs.createWriteStream(dest);
    var zipPath = 'https://s3-us-west-2.amazonaws.com/code.famo.us/cli/' + name + '.tar.gz'
    var request = https.get(zipPath, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
}

/** **/
module.exports = forkProject;

