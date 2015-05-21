'use strict';

var inquirer = require('inquirer');
var async = require('async');
var logout = require('../../res/sdk-bundle.js').user.logout;
var storage = require('../../res/sdk-bundle.js').storage;
var famouserror = require('../error');

/**
 * logoutCLI
 *  prompt a user to login to Famous Cloud Services
 */
var logoutCLI = function() {
    var logoutConfirm = {
        type: 'confirm',
        name: 'logout',
        message: 'Are you sure you would like to logout?'
    };

    async.waterfall([
        function(callback) {
            inquirer.prompt([logoutConfirm], function(answer) {
                callback(null, answer);
            });
        },
        function(answer, callback) {
            if (answer.logout == true) {
                logout(function(err, data) {
                    return callback(err, data);
                });
            }
        },
        function(data, callback) {
            storage.setGlobal({}, function(err) {
                return callback(err);
            });
        }
    ],
    function (err, data) {
        if (err) {
            var message = famouserror.message(error, data);
            if (message) {
                console.log(message);
                process.exit(1);
            }
            return;
        }
        console.log('success!');
    });
};


/** **/
module.exports = logoutCLI;

