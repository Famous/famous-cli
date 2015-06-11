'use strict';

var spawn = require('win-spawn');
var pkg = require('../package');
var chalk = require('chalk');
var ver = require('latest-version');
var async = require('async');

var tosCheck = require('./user/tosCheck.js');
var storage = require('../res/sdk-bundle.js').storage;

var checkTOS = function checkTOS(config, callback) {
    if (!config) {
        config = {};
    }
    if (config.tos !== true) {
        return tosCheck(callback);
    }
    return callback(null);
};

var checkTracking = function (callback) {
    async.waterfall([
        storage.getGlobal,
        checkTOS
    ],
    function (error) {
        return callback(error);
    });
};

/**
 * update
 *  run the update command
 * @param {function} callback function to execute with the return code from the update command
 */
var update = function (callback) {
    var child = spawn('npm', ['install', '-g', 'famous-cli']);

    child.on('close', function (code) {
        if (code === 0) {
            return callback(null);
        }
        return callback(code);
    });
};

/**
 * autoupdate
 *  check for update and execute if the current version in package.json is behind the latest version published in npm
 * implicitly calls update if one is required
 * @param {function} callback to execute on completion of update check
 */
var autoupdate = function (callback) {
    var current = pkg.version;
    checkTracking(function () {
        ver('famous-cli', function(err, version) {
            if (err) {
                return callback(err);
            }
            if (current !== version) {
                console.log(chalk.bold('Famous'), 'CLI version', current, 'is out of date.', 'Updating to', version);
                return update(callback);
            }
            return callback();
        });
    });
};

/** **/
module.exports = autoupdate;

