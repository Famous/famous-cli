'use strict'

var fs = require('fs');
var path = require('path');
var spawn = require('win-spawn');
var chalk = require('chalk');

var npm = require('../util/npm');

var develop = function develop(options) {
    var jsonPath = path.join(process.cwd(), 'package.json');
    var json;
    fs.readFile(jsonPath, 'utf8', function (err, data) {
        if (err) throw err;

        try {
            json = JSON.parse(data);
        } catch (ex) {
            json = null;
        }

        var modulesPath = path.join(process.cwd(), 'node_modules');

        if (json && json.scripts && json.scripts.dev) {
            npm.checkInstall(null, function(){
                runDev();
            });

        } else {
            console.log(chalk.bold.red('You don\'t appear to be in a famous project'))
        }
    });
};

var runDev = function() {
    var dev = spawn('npm', ['run', 'dev']);
    dev.stdout.pipe(process.stdout);
    dev.stderr.pipe(process.stderr);
    dev.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
};

module.exports = develop;
