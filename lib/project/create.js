'use strict';

var async = require('async');
var chalk = require('chalk');
var path = require('path');

var create = require('../init/create');
var link = require('./link');
var deploy = require('../deploy').deployProject;
<<<<<<< HEAD
var seedTools = require('../util/seedTools');
var waterfallChain = require('../util/waterfallDecorator').waterfallChain;

var seedHooks = function seedHooks(callback) {
    seedTools.setHooks({'deploy': ['install', ['run', 'build']]}, callback);
=======
var waterfallVariadic = require('../util/waterfallDecorator').waterfallVariadic;


var changeDir = function(name, callback) {
    if (name) {
        var seedPath = path.join(process.cwd(), name);
        process.chdir(seedPath);
    }
    callback(null, name);
>>>>>>> Added variadic waterfall function
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
        link,
        waterfallChain(seedHooks),
        waterfallVariadic(deploy, 'public')
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

