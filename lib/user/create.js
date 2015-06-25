'use strict';

var async = require('async');
var chalk = require('chalk');

var createUserSDK = require('../../res/sdk-bundle.js').user.create;
var login = require('../../res/sdk-bundle.js').user.login;
var storage = require('../../res/sdk-bundle.js').storage;
var famouserror = require('../error');
var waterfallFunctions = require('../util/waterfallDecorator');
var prompt = require('../util/inquirer');

/**
 * createUser
 *  register a user with Famous Cloud Services
 *
 */
var createUser = function(done) {

    async.waterfall([
        waterfallFunctions.waterfallChain(prompt.promptChainer(['email', 'username', 'password', 'reEnterPassword'])),
        prompt.validator,
        waterfallFunctions.waterfallPipe(createUserSDK),
        login,
        storage.setGlobal
    ],
    function (error, data) {
        if (error) {
            var message = famouserror.message(error, data);
            if (message) {
                console.log(message);
                return process.exit(1);
            }
        }
        console.log(chalk.blue('\nAccount creation successful, you have been logged in!'));
        return done(null, data);
    });
};

var createUserCLI = function() {
    createUser(function(){});
};

/** **/
module.exports.createUser = createUser;
module.exports.createUserCLI = createUserCLI;
