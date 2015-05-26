'use strict';

var inquirer = require('inquirer');
var async = require('async');
var fs = require('fs');
var updateProject = require('./project/update');
var famouserror = require('./error');
var storage = require('../res/sdk-bundle').storage;
var chalk = require('chalk');
var register = require('./user/create');
var link = require('./project/link');
var npm = require('./util/npm');

var deployProject = function() {
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
            storage.getGlobal(function(err, data) {
                if (!data || !data.authentication_token) {
                    return callback(new Error('no-token'), null);
                }
                return callback(err, data);
            });
        }, function(data, callback) {
            storage.getProjectMeta(function(err, data) {
                if (!data || !data.widget_id) {
                    link(null, function() {
                        return callback(err, data);
                    })
                } else {
                    return callback(err, data);
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
            if (error.message == 'not-empty-folder') {
                console.log(
                    chalk.red('\n\r Directory is empty, please use'),
                    chalk.red.bold('famous create.\n\r')
                );
            } else if (error.message == 'error-npm-install') {
                console.log(
                    chalk.red('\n\r Error while building\r')
                );
            } else if (error.message == 'error-build') {
                console.log(
                    chalk.red('\n\r Error while building\n\r')
                );
            } else if (error.message == 'no-token') {
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

