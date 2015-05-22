'use strict';

var inquirer = require('inquirer');
var async = require('async');
var createUser = require('../../res/sdk-bundle.js').user.create;
var login = require('../../res/sdk-bundle.js').user.login;
var storage = require('../../res/sdk-bundle.js').storage;
var famouserror = require('../error');
var metrics = require('../metrics/mixpanel');
var chalk = require('chalk');

/**
 * createUserCLI
 *  register a user with Famous Cloud Services
 *
 */
var createUserCLI = function() {
    var emailPrompt = {
type: 'input',
      name: 'email',
      message: 'Email: '
    };

    var usernamePrompt = {
type: 'input',
      name: 'username',
      message: 'User Name: '
    };

    var passPrompt = {
type: 'password',
      name: 'password',
      message: 'Password: '
    };

    var eulaPrompt = {
type: 'confirm',
      name: 'eula',
      message: "View the Famous Cloud Services TOS at 'http://famous.org/terms.html', do you accept"
    };

    var loginPrompt = {
type: 'confirm',
      name: 'login',
      message: 'Account creation successful, would you like to login?'
    };

    async.waterfall([
            function(callback){
            inquirer.prompt([emailPrompt, usernamePrompt, passPrompt, eulaPrompt], function(answers) {
                if (!answers.eula) {
                  console.log(chalk.bold.red('You must agree to the eula to register with Hub'));
                  process.exit(1);
                }
                return callback(null, answers);
            },
            function(answers, callback) {
            createUser(answers, function(err, data) {
                if (err) {
                return callback(err, data);
                }
                return callback(null, answers);
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
            return;
        }
        console.log(chalk.blue('\nAccount creation successful, you have been logged in!'));
    });
};

/** **/
module.exports = createUserCLI;

