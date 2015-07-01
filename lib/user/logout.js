'use strict';

var async = require('async');
var chalk = require('chalk');

var famouserror = require('../error');
var logout = require('../../res/sdk-bundle.js').user.logout;
var storage = require('../../res/sdk-bundle.js').storage;
var promptFactory = require('../util/inquirer').promptFactory;

var editSession = function editSession(data, callback) {
    var newSession = {};
    newSession.user = {};
    newSession.authentication_token = null;
    return callback(null, newSession);
};

var destroySession = function destroySession() {
    async.waterfall([
        logout,
        editSession,
        storage.setGlobal
    ],
    function (error, data) {
        if (error) {
            if (error.message === '401') {
                return console.log(chalk.red('\n\rYou are not logged in yet.\n\r'));
            }
            var message = famouserror.message(error, data);
            if (message) {
                return console.log(message);
            }
        } else {
            console.log(chalk.bold('Famous'), 'logout successful!');
        }
    });
};

/**
 * logoutCLI
 *  prompt a user to login to Famous Cloud Services
 */
var logoutCLI = function() {
    promptFactory('logout')(function(err, data) {
        if (err) {
            return;
        }
        if (data && data.logout) {
            destroySession();
        }
    });
};


/** **/
module.exports = logoutCLI;

