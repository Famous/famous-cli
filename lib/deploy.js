'use strict';

var async = require('async');
var fs = require('fs');
var chalk = require('chalk');

var updateProject = require('./project/update');
var famouserror = require('./error');
var storage = require('../res/sdk-bundle').storage;
var register = require('./user/create');
var link = require('./project/link');
var npm = require('./util/npm');
var noSession = require('./user/noSession');

/**
 * deployProject
 *
 * Uploads project to Hub Services.
 */
var deployProject = function(directory, callback) {

    var installBuild = function(data, cb) {
        if (directory !== 'public') {
            return cb(null, data);
        }
        async.waterfall([
            npm.checkInstall,
            npm.runBuild
        ], function(error, results) {
            return cb(error, results);
        });
    };

    async.waterfall([
        function(cb) {
            fs.readdir(process.cwd(), function (err, files) {
                if (err) {
                    console.log(err, files);
                    return cb(err, null);
                }
                if (files.length <= 0) {
                    return cb(new Error('not-empty-folder'), null);
                }
                return cb(null, files);
            });
        }, function(data, cb) {
            storage.getGlobal(function(err, config) {
                if (!config || !config.authentication_token) {
                    return noSession(cb);
//                    return cb(new Error('no-token'), null);
                }
                return cb(err, config);
            });
        }, function(data, cb) {
            storage.getProjectMeta(function(err, config) {
                if (!config || !config.widget_id) {
                    link(null, function() {
                        return cb(err, config);
                    });
                } else {
                    return cb(err, config);
                }
            });
        },
        installBuild,
        function(data, cb) {
            return updateProject(directory, cb);
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

var deployCLI = function(directory) {
    if (!directory) {
        directory = 'public';
    }
    deployProject(directory, function(){});
};

/** **/

module.exports.deployCLI = deployCLI;
module.exports.deployProject = deployProject;
