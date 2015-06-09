'use strict';

var async = require('async');
var fs = require('fs');
var chalk = require('chalk');
var inquirer = require('inquirer');

var updateProject = require('./project/update');
var famouserror = require('./error');
var storage = require('../res/sdk-bundle').storage;
var createUser = require('../res/sdk-bundle').user.create;
var login = require('../res/sdk-bundle').user.login;
var loginFlow = require('./inquirer/loginFlow');
var register = require('./user/create');
var auto = require('./util/autogenerate');
var link = require('./project/link');
var npm = require('./util/npm');
var noSession = require('./user/noSession');

var deployCLI = function(directory) {
    if (!directory) {
        directory = 'public';
    }
    deployProject(directory, function(){});
};

/**
 * deployProject
 *
 * Uploads project to Hub Services.
 */
var deployProject = function(directory, callback) {

    var installBuild = function(data, callback) {
        if (directory !== 'public') {
            return callback(null, data);
        }
        async.waterfall([
            npm.checkInstall,
            npm.runBuild,
        ], function(error, results) {
            return callback(error, results);
        });
    }

    async.waterfall([
        function(callback) {
            fs.readdir(process.cwd(), function (err, files) {
                if (err) {
                    console.log(err, files);
                    return callback(err, null);
                }
                if (files.length <= 0) {
                    return callback(new Error('not-empty-folder'), null);
                }
                return callback(null, files);
            });
        }, function(data, callback) {
            storage.getGlobal(function(err, config) {
                if (!config || !config.authentication_token) {
                    return noSession(callback);
//                    return callback(new Error('no-token'), null);
                }
                return callback(err, config);
            });
        }, function(data, callback) {
            storage.getProjectMeta(function(err, config) {
                if (!config || !config.widget_id) {
                    link(null, function() {
                        return callback(err, config);
                    });
                } else {
                    return callback(err, config);
                }
            });
        },
        installBuild,
        function(data, callback) {
            return updateProject(directory, callback);
        }
    ],
    function (error, results) {
        if (error) {
            if (error.message === 'not-empty-folder') {
                console.log(
                    chalk.red('\n\r Directory is empty, please use'),
                    chalk.red.bold('famous create.\n\r')
                );
            } else if (error.message === 'error-npm-install') {
                console.log(
                    chalk.red('\n\r Error while building\r')
                );
            } else if (error.message === 'error-build') {
                console.log(
                    chalk.red('\n\r Error while building\n\r')
                );
            } else if (error.message === 'no-token') {
                console.log(
                    chalk.red('\n\r You must be authenticated, please login or register:')
                );
                register();
            } else {
                var message = famouserror.message(error, results);
                if (message) {
                    console.log(message);
                    process.exit(1);
                }
                return;
            }
        }
        callback(error, results);
    });
};

/** **/

module.exports.deployCLI = deployCLI;
module.exports.deployProject = deployProject;
