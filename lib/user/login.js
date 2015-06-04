'use strict';

var async = require('async');
var chalk = require('chalk');
var inquirer = require('inquirer');

var famouserror = require('../error');
var login = require('../../res/sdk-bundle.js').user.login;
var loginFlow = require('../inquirer/loginFlow');
var storage = require('../../res/sdk-bundle.js').storage;

/**
 * loginCLI
 *  prompt a user to login to Famous Cloud Services
 */
var loginCLI = function() {

    async.waterfall([
        loginFlow,
        login,
        storage.setGlobal
    ],
    function (error, data) {
        if (error) {
            var message = famouserror.message(error, data);
            if (message) {
                return console.log(message);
            }
        }
        return console.log(chalk.bold('Famous'), 'login successful!');
    });
};


/** **/
module.exports = loginCLI;

