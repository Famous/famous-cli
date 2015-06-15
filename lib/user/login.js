'use strict';

var async = require('async');
var chalk = require('chalk');

var famouserror = require('../error');
var login = require('../../res/sdk-bundle.js').user.login;
var storage = require('../../res/sdk-bundle.js').storage;
var waterfallChain = require('../util/waterfallDecorator').waterfallChain;
var promptChainer = require('../util/inquirer').promptChainer;

/**
 * loginCLI
 *  prompt a user to login to Famous Cloud Services
 */
var loginCLI = function() {

    async.waterfall([
        waterfallChain(promptChainer(['email', 'password'])),
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

