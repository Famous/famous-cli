'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('win-spawn');
var chalk = require('chalk');

var npm = require('../util/npm');

var runDev = function() {
    var dev = spawn('npm', ['run', 'dev'], {stdio:'inherit'});

    dev.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
};

var develop = function develop() {
    var jsonPath = path.join(process.cwd(), 'package.json');
    var json;
    fs.readFile(jsonPath, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        try {
            json = JSON.parse(data);
        } catch (ex) {
            json = null;
        }

        if (json && json.scripts && json.scripts.dev) {
            npm.checkInstall(null, function(){
                runDev();
            });

        } else {
            console.log(chalk.bold.red('You don\'t appear to be in a famous project'));
        }
    });
};


module.exports = develop;
