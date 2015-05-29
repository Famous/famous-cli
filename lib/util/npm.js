'use strict';

var spawn = require('win-spawn');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var npm = {};

npm.runBuild = function runBuild(data, callback) {
    var build = spawn('npm', ['run', 'build']);

    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);

    build.on('close', function (code) {
        if (code !== 0) {
            return callback(new Error('error-build'), null);
        }
        return callback(null, data);
    });
};

npm.checkInstall = function checkInstall(data, callback) {
    var modulesPath = path.join(process.cwd(), 'node_modules');
    try {
        fs.lstatSync(modulesPath);
        return callback(null, data);
    } catch (e) {
        console.log(chalk.bold.yellow('Node Modules not yet installed, attempting to do so now.'));
        var install = spawn('npm', ['install']);
        install.stdout.pipe(process.stdout);
        install.stderr.pipe(process.stderr);
        install.on('close', function (code) {
            if (code !== 0) {
                return callback(new Error('error-npm-install'), null);
            }
            return callback(null, data);
        });
    }
};

module.exports = npm;
