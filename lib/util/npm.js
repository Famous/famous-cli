'use strict';

var spawn = require('win-spawn');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var async = require('async');

var storage = require('../../res/sdk-bundle.js').storage;

var npm = {};

npm.runHook = function runHook(hook, callback) {
    storage.getProjectMeta(function(error, config) {
        if (config && config.scripts && config.scripts[hook]) {
            npm.runScripts(config.scripts[hook], callback);
        } else {
            return callback(null, 1);
        }
    });
};

/**
 * run
 *
 * Runs an arbitrary npm script.
 *
 */
npm.run = function run(command, callback) {
    if (typeof command === 'string') {
        command = [command];
    }
    var runner = spawn('npm', command, {stdio: 'inherit'});
    runner.on('close', function (code) {
        if (code !== 0) {
            return callback(new Error('error-' + command, null));
        }
        return callback(null, 0);
    });
};

/**
 * runScripts
 *
 * Runs an array npm scripts.
 *
 */
npm.runScripts = function runScripts(commands, callback) {
    if (typeof commands === 'string') {
        npm.run(commands, callback);
    } else {
        async.eachSeries(commands, npm.run, callback);
    }
};

/**
 * runBuild
 *
 * Runs a npm build script.
 *
 */
npm.runBuild = function runBuild(data, callback) {

    if (!callback) {
        callback = data;
    }

    var build = spawn('npm', ['run', 'build'], {stdio: 'inherit'});
    build.on('close', function (code) {
        if (code !== 0) {
            return callback(new Error('error-build'), null);
        }
        return callback(null, data);
    });
};


/**
 * checkInstall
 *
 * Checks to see if node_modules are installed, and if not attempt to install them.
 *
 */
npm.checkInstall = function checkInstall(data, callback) {

    if (!callback) {
        callback = data;
    }

    var modulesPath = path.join(process.cwd(), 'node_modules');
    var jsonPath = path.join(process.cwd(), 'package.json');
    try {
        fs.lstatSync(jsonPath);
    } catch (e) {
        console.log(chalk.bold.red('You don\'t appear to be in a famous project'));
        process.exit(1);
    }
    try {
        fs.lstatSync(modulesPath);
        return callback(null, data);
    } catch (e) {
        console.log(chalk.bold.cyan('Node Modules not yet installed, attempting to do so now.'));
        var install = spawn('npm', ['install'], {stdio: 'inherit'});
        install.on('close', function (code) {
            if (code !== 0) {
                return callback(new Error('error-npm-install'), null);
            }
            return callback(null, data);
        });
    }
};

module.exports = npm;
