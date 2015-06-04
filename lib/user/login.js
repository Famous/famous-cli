'use strict';

var inquirer = require('inquirer');
var async = require('async');
var login = require('../../res/sdk-bundle.js').user.login;
var storage = require('../../res/sdk-bundle.js').storage;
var famouserror = require('../error');
var chalk = require('chalk');

/**
 * loginCLI
 *  prompt a user to login to Famous Cloud Services
 */
var loginCLI = function(callback) {
    var emailPrompt = {
        type: 'input',
        name: 'email',
        message: 'Email: '
    };

    var passwordPrompt = {
        type: 'password',
        name: 'password',
        message: 'Password: '
    };

    async.waterfall([
        function(cb){
            inquirer.prompt([emailPrompt, passwordPrompt], function(answers) {
                cb(null, answers);
            });
        },
        login,
        storage.setGlobal
    ],
    function (error, data) {
        if (error) {
            var message = famouserror.message(error, data);
            if (message) {
                console.log(message);
                process.exit(1);
            }
            return callback();
        }
        console.log(chalk.bold('Famous'), 'login successful!');
        return callback(error, data);
    });
};


/** **/
module.exports = loginCLI;

