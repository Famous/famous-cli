'use strict';

var inquirer = require('inquirer');
var async = require('async');
var chalk = require('chalk');
var path = require('path');

var createProject = require('../init/create');
var link = require('./link');

/**
 * createProjectCLI
 */
var createProjectCLI = function(options) {
    if (typeof options === 'string') {
        var name = options;
    }

    async.waterfall([
        function(callback) {
            createProject(name, function(){
                if (name) {
                    var seedPath = path.join(process.cwd(), name);
                    process.chdir(seedPath);
                }
            });
            callback(null, name)
        },
        link
    ],
    function (error, data) {
        if (error) {
            console.log(chalk.blue('A seed project has been created at: ' + process.cwd()))
            // console.log(error);
        } else {
            console.log(chalk.blue('A seed project has been created at: ' + process.cwd()))
        }


    });
};

/** **/
module.exports = createProjectCLI;

