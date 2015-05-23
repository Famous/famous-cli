'use strict';

var inquirer = require('inquirer');
var async = require('async');
var forkProject = require('../init/fork');
var chalk = require('chalk');
var path = require('path');

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
                var data = {name: name};
                createBlockHTTP(data, function(error, res) {
                    if (error) {
                        console.log(chalk.bold.blue('Seed project created at: ' + process.cwd()));
                        // console.log(chalk.bold.red('A famous account is required to deploy to Hub. Please use $famous register.'));
                    } else {
                        // console.log('A hub widget has been created with the id of: ', res.block.id);
                        data.block_id = res.block.id;
                        setProjectMeta({'widget_id': res.block.id, 'widget_name': res.block.name}, function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        callback(null, data);
                    }
                });
            });
        },
        createContainer
    ],
    function (error, answers) {
        if (error) {
            console.log(error);
        } else {
            var data = {};
            
            data.container_id = answers.container.id;
            data.container_name = answers.container.name;

            setProjectMeta(data, function(er) {
                if (er) {
                    console.log(er);
                }
            });

            // console.log('A hub container has been created with the id of: ', answers.container.id);
            console.log(chalk.blue('A seed project has been created at: ' + process.cwd()))
        }


    });
};

/** **/
module.exports = forkProjectCLI;

