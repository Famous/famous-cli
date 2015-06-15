'use strict';

var async = require('async');

var login = require('../../res/sdk-bundle').user.login;
var auto = require('./../util/autogenerate');
var createUser = require('../../res/sdk-bundle').user.create;
var storage = require('../../res/sdk-bundle').storage;
var waterfallChain = require('../util/waterfallDecorator').waterfallChain;
var promptFunctions = require('../util/inquirer');

/**
 * noSession
 *
 * Attempts to login user or create ghost user for Hub Services when no session is detected.
 */
var noSession = function(callback) {

    async.waterfall([
        waterfallChain(promptFunctions.promptFactory('login')),
        function(response, cb){
            if (response.login) {
                promptFunctions.promptChainer(['email', 'password'])(cb);
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
