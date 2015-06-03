'use strict';

var spawn = require('win-spawn');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var npm = {};


/**
 * runBuild
 *
 * Runs a npm build script.
 *
 */
npm.runBuild = function runBuild(data, callback) {
    var build = spawn('npm', ['run', 'build'], {stdio:'inherit'});
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
    var modulesPath = path.join(process.cwd(), 'node_modules');
    try {
        fs.lstatSync(modulesPath);
        return callback(null, data);
    } catch (e) {
        console.log(chalk.bold.yellow('Node Modules not yet installed, attempting to do so now.'));
        var install = spawn('npm', ['install'], {stdio:'inherit'});
        install.on('close', function (code) {
            if (code !== 0) {
                return callback(new Error('error-npm-install'), null);
            }
            return callback(null, data);
        });
    }
};

module.exports = npm;
