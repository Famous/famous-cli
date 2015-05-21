'use strict';

var spawn = require('child_process').spawn;
var pkg = require('../package');
var chalk = require('chalk');

/**
 * autoupdate
 *  check for update and execute if the current version in package.json is behind the latest version published in npm
 * implicitly calls update if one is required
 * @param {function} callback to execute on completion of update check
 */
var autoupdate = function (callback) {
    var current = pkg.version;
    var versions;
    var latest;
    var child = spawn('npm', ['view', 'famous-cli', 'versions']);

    child.stdout.on('data', function(data) {
        versions = data.toString();

        versions = versions.replace(/\s|\]/g, '');
        versions = versions.replace(/\'/g, '');
        versions = versions.split(',');
        latest = versions[versions.length -1];

        if (current < latest) {
            console.log(chalk.bold('Famous'), 'CLI version', current, 'is out of date.', 'Updating to', latest);
            return update(callback);
        }

        return callback();
    }); 
};

/**
 * update
 *  run the update command
 * @param {function} callback function to execute with the return code from the update command
 */
var update = function (callback) {
    var child = spawn('npm', ['update', '-g', 'famous-cli']);
    
    child.on('close', function (code) {
        if (code === 0) {
            return callback(null);
        }
        return callback(code);
    });
};

/** **/
module.exports = autoupdate;

