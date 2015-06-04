'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('win-spawn');
var chalk = require('chalk');

var npm = require('../util/npm');


/**
 * runDev
 *
 *  Runs the npm dev script in a seed project.
 */
var runDev = function() {
    var dev = spawn('npm', ['run', 'dev'], {stdio: 'inherit'});

    dev.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
};

/**
 * develop
 *
 * Runs the dev server of a seed project.
 */
var develop = function develop() {
    var jsonPath = path.join(process.cwd(), 'package.json');
    var json;
    try {
        fs.lstatSync(jsonPath);
    } catch (e) {
        console.log(chalk.bold.red('You don\'t appear to be in a famous project'));
        process.exit(1);
    }
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
