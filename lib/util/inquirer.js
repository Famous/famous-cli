'use strict';

var inquirer = require('inquirer');
var async = require('async');

var waterfallChain = require('../util/waterfallDecorator').waterfallChain;

var inquirerPrompts = {};


inquirerPrompts.email = {
    type: 'input',
    name: 'email',
    message: 'Email: '
};

inquirerPrompts.username = {
    type: 'input',
    name: 'username',
    message: 'User Name: '
};

inquirerPrompts.password = {
    type: 'password',
    name: 'password',
    message: 'Password: '
};

inquirerPrompts.reEnterPassword = {
    type: 'password',
    name: 'reEnterPassword',
    message: 'Please re-enter password: '
};

inquirerPrompts.login = {
    type: 'confirm',
    name: 'login',
    message: 'No current user session. Login to an existing Famous Cloud Services account?: '
};

inquirerPrompts.logout = {
    type: 'confirm',
    name: 'logout',
    message: 'Are you sure you would like to logout?'
};

var promptFunctions = {};

var usernameRegex = /^[a-z]([0-9a-z\-\_])*$/;

promptFunctions.validator = function validator(answers, callback) {
    if (answers.password !== answers.reEnterPassword) {
        return callback(new Error('passwords-not-matching'));
    }
    if (answers.username) {
        if (!answers.username.match(usernameRegex)) {
            return callback(new Error('invalid-username'));
        }
    }
    return callback(null, answers);
};

promptFunctions.promptFactory = function promptFactory(name) {
    var question = inquirerPrompts[name];
    return function(callback) {
        inquirer.prompt([question], function(answers) {
            return callback(null, answers);
        });
    };
};

promptFunctions.promptChainer = function promptChainer(names) {
    var waterfall = [];
    for (var i = 0; i < names.length; i++) {
        waterfall.push(waterfallChain(promptFunctions.promptFactory(names[i])));
    }
    return function(callback) {
        async.waterfall(waterfall, function(error, results) {
            callback(error, results);
        });
    };
};

/** **/
module.exports = promptFunctions;
