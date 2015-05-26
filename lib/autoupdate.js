'use strict';

var spawn = require('child_process').spawn;
var pkg = require('../package');
var chalk = require('chalk');
var ver = require('latest-version');
var async = require('async');
var inquirer = require('inquirer');

var metrics = require('./metrics/mixpanel.js');
var storage = require('../res/sdk-bundle.js').storage;

var trackingPrompt = {
  type: 'confirm',
  name: 'tracking',
  message: "May famous anonymously report usage statistics to improve the tool over time?"
};

/**
 * autoupdate
 *  check for update and execute if the current version in package.json is behind the latest version published in npm
 * implicitly calls update if one is required
 * @param {function} callback to execute on completion of update check
 */

function checkTracking(callback) {
  
    async.waterfall([
        storage.getGlobal,
        function (config, callback) {
            if (config.tracking !== undefined) {
                return callback('already answered');
            }

            return inquirer.prompt(trackingPrompt, function (answers) {
                return metrics.setTracking(answers.tracking, callback)
            });
        }
    ], 
    function (error) {
        if (error === 'already answered') {
            error = null;
        }

        return callback(error);
    });
};

var autoupdate = function (callback) {
    var current = pkg.version;

    checkTracking(function (err) {
      if (err) return callback(err);
      
      ver('famous-cli', function(err, version) {
          if (current < version) {
              console.log(chalk.bold('Famous'), 'CLI version', current, 'is out of date.', 'Updating to', version);
              return update(callback);
          }
          return callback();
      });
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

/** **/
module.exports = autoupdate;

