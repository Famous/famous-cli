'use strict';

var async = require('async');
var chalk = require('chalk');
var path = require('path');

var create = require('../init/create');
var link = require('./link');
var seedTools = require('../util/seedTools');
var waterfallChain = require('../util/waterfallDecorator').waterfallChain;
var waterfallVariadic = require('../util/waterfallDecorator').waterfallVariadic;
var npm = require('../util/npm');

var seedHooks = function seedHooks(callback) {
    seedTools.setHooks({'deploy': [['run', 'build']], 'setup': ['install']}, callback);
};

var changeDir = function changeDir(name, callback) {
    if (name) {
        var seedPath = path.join(process.cwd(), name);
        process.chdir(seedPath);
    }
    callback(null, name);
};

/**
 * createProject
 *
 * Creates a famous seed repo in the current directory. If a name flag is
 * present, it creates a subdirectory and inits the seed project in the named subdirectory.
 */
var createProject = function(options) {
    if (typeof options === 'string') {
        var name = options;
    }


    async.waterfall([
        waterfallVariadic(create, name),
        waterfallVariadic(changeDir, name),
        waterfallVariadic(link, name),
        waterfallChain(seedHooks),
        waterfallVariadic(npm.runHook, 'setup')
    ],
    function (error, data) {
        if (error) {
            console.log(chalk.blue('A seed project has been created at: ' + process.cwd()));
            // console.log(error);
        } else {
            console.log(chalk.blue('A seed project has been created at: ' + process.cwd()));
        }
        if (data) {
            // log autodeploy
        }
    });
};

/** **/
module.exports = createProject;

