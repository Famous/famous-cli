'use strict';

var async = require('async');
var chalk = require('chalk');
var path = require('path');

var forkProject = require('../init/fork');
var link = require('./link');
var seedTools = require('../util/seedTools');
var waterfallChain = require('../util/waterfallDecorator').waterfallChain;
var waterfallVariadic = require('../util/waterfallDecorator').waterfallVariadic;
var npm = require('../util/npm');

var seedHooks = function seedHooks(callback) {
    seedTools.setHooks({'deploy': [['run', 'build']], 'setup': ['install']}, callback);
};


/**
 * forkProjectCLI
 *
 * Creates a famous tutorial repo. Currently works with the options
 * twitterus-tutorial or carousel-tutorial.
 */
var forkProjectCLI = function(options) {
    if (typeof options === 'string') {

        var dict = {
            'twitterus-tutorial': 'lesson-twitterus-starter-kit',
            'carousel-tutorial': 'lesson-carousel-starter-kit'
        };
        var name = dict[options];
    }

    if (!name) {
        console.log(chalk.bold.red('Famous fork currently only works with the options twitterus-tutorial and carousel-tutorial'));
    }

    async.waterfall([
        function(callback) {
            forkProject(name, function(){
                if (name) {
                    var seedPath = path.join(process.cwd(), name);
                    process.chdir(seedPath);
                }
                callback(null, name);
            });
        },
        link,
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
module.exports = forkProjectCLI;

