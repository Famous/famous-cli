'use strict';

var async = require('async');
var chalk = require('chalk');
var path = require('path');

var create = require('../init/create');
var link = require('./link');

/**
 * initProject
 *
 * Creates a famous seed repo in the current directory. If a name flag is
 * present, it creates a subdirectory and inits the seed project in the named subdirectory.
 */
var initProject = function(options) {
    if (typeof options === 'string') {
        var name = options;
    }

    async.waterfall([
        function(callback) {
            create(name, function(){
                if (name) {
                    var seedPath = path.join(process.cwd(), name);
                    process.chdir(seedPath);
                }
            });
            callback(null, name);
        },
        link
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
module.exports = initProject;
