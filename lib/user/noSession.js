'use strict';

var async = require('async');
var inquirer = require('inquirer');

var login = require('../../res/sdk-bundle').user.login;
var loginFlow = require('./../inquirer/loginFlow');
var auto = require('./../util/autogenerate');
var createUser = require('../../res/sdk-bundle').user.create;
var storage = require('../../res/sdk-bundle').storage;

/**
 * noSession
 *
 * Attempts to login user or create ghost user for Hub Services when no session is detected.
 */
var noSession = function(callback) {
    var loginPrompt = {
        type: 'confirm',
        name: 'login',
        message: 'No current user session. Login to an existing Famous Cloud Services account?: '
    };

    async.waterfall([
        function(cb){
            inquirer.prompt([loginPrompt], function(answers) {
                cb(null, answers);
            });
        },
        function(response, cb){
            if (response.login) {
                loginFlow(function(error, data) {
                    cb(error, data);
                });
            } else {
                auto.generate(function(error, data){
                    createUser(data, function(err) {
                        cb(err, {email: data.email, password: data.password});
                    });
                });
            }
        },
        login,
        storage.setGlobal,
        function (data, cb) {
            storage.getGlobal(cb);
        }
    ],
    function (error, data) {
        if (error === 'login') {
            callback(null, data);
        }
        callback(error, data);
    });
};

module.exports = noSession;
