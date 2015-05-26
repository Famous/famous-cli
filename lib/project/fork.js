'use strict';

var inquirer = require('inquirer');
var async = require('async');
var forkProject = require('../init/fork');
var chalk = require('chalk');
var path = require('path');

var link = require('./link');

var setProjectMeta = require('../../res/sdk-bundle.js').storage.setProjectMeta;
var getProjectMeta = require('../../res/sdk-bundle.js').storage.getProjectMeta;
var createBlockHTTP = require('../../res/sdk-bundle.js').widget.create;
var createContainer = require('../../res/sdk-bundle.js').container.create;


/**
 * forkProjectCLI
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
        console.log(chalk.bold.red('Famous fork currently only works with the options twitterus-tutorial and carousel-tutorial'))
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
        link
    ],
    function (error, answers) {
        if (error) {
            console.log(error);
        } else {

            // console.log('A hub container has been created with the id of: ', answers.container.id);
            console.log(chalk.blue('A seed project has been created at: ' + process.cwd()))
        }


    });
};

/** **/
module.exports = forkProjectCLI;

