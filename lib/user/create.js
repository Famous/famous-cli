'use strict';

var async = require('async');
var chalk = require('chalk');

var createUser = require('../../res/sdk-bundle.js').user.create;
var login = require('../../res/sdk-bundle.js').user.login;
var storage = require('../../res/sdk-bundle.js').storage;
var famouserror = require('../error');
var waterfallFunctions = require('../util/waterfallDecorator');
var prompt = require('../util/inquirer');

/**
 * createUserCLI
 *  register a user with Famous Cloud Services
 *
 */
var createUserCLI = function() {

    async.waterfall([
        waterfallFunctions.waterfallChain(prompt.promptChainer(['email', 'username', 'password', 'reEnterPassword'])),
        prompt.validator,
        waterfallFunctions.waterfallPipe(createUser),
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

