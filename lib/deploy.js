'use strict';

var inquirer = require('inquirer');
var async = require('async');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var updateProject = require('./project/update');
var famouserror = require('./error');
var storage = require('../res/sdk-bundle').storage;
var chalk = require('chalk');
var register = require('./user/create');
var link = require('./project/link');

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
                    link(function() {
                        return callback(err, data);
                    })
                } else {
                    return callback(err, data);
                }
            });
        }, function(data, callback) {
            var modulesPath = path.join(process.cwd(), 'node_modules');
            try {
                var stats = fs.lstatSync(modulesPath);
                return callback(null, data);
            } catch (e) {
                console.log(chalk.bold.yellow('Node Modules not yet installed, attempting to do so now.'));
                var install = spawn('npm', ['install']);
                install.stdout.pipe(process.stdout)
                install.stderr.pipe(process.stderr);
                install.on('close', function (code) {
                    if (code !== 0) {
                        return callback(new Error('error-npm-install'), null);
                    }
                    return callback(null, data);
                });
            }
        }, function(data, callback) {
            var build = spawn('npm', ['run', 'build']);

            build.stdout.pipe(process.stdout);
            build.stderr.pipe(process.stderr);

            build.on('close', function (code) {
                if (code !== 0) {
                    return callback(new Error('error-build'), null);
                }
                return callback(null, data);
            });
        }, function(data, callback) {
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

