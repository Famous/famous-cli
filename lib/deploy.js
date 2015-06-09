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


/**
 * noSession
 *
 * Attempts to login user or create ghost user for Hub Services when no session is detected.
 */
var noSession = function(callback) {
    var loginPrompt = {
        type: 'confirm',
        name: 'login',
        message: 'No current user session. Login to an existing Famous Cloud Services account?: '
    };

    async.waterfall([
        function(cb){
            inquirer.prompt([loginPrompt], function(answers) {
                cb(null, answers);
            });
        },
        function(response, cb){
            if (response.login) {
                loginFlow(function(error, data) {
                    cb(error, data);
                });
            } else {
                auto.generate(function(error, data){
                    createUser(data, function(err) {
                        cb(err, {email: data.email, password: data.password});
                    });
                });
            }
        },
        login,
        storage.setGlobal,
        function (data, cb) {
            storage.getGlobal(cb);
        }
    ],
    function (error, data) {
        if (error === 'login') {
            callback(null, data);
        }
        callback(error, data);
    });
};

/**
 * deployProject
 *
 * Uploads project to Hub Services.
 */
var deployProject = function() {
    console.log('hellor')
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
        }, npm.checkInstall,
        npm.runBuild,
        function(data, callback) {
            return updateProject(callback);
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
    });
};

/** **/

module.exports = deployProject;

