'use strict';

var async = require('async');
var chalk = require('chalk');
var createScaffold = require('./create');
var famouserror = require('../../error');
var inquirer = require('inquirer');
var login = require('../../../res/sdk-bundle.js').user.login;
var loginFlow = require('../../inquirer/loginFlow');

var VALID_USERNAME_REGEXP = /^[a-z\-]+$/;
var VALID_COMPONENT_NAME_REGEXP = /^[a-z\-\:]+$/;

function nameOkPrompt(username, componentName, cb) {
    var fullName = username + ':' + componentName;
    inquirer.prompt([{
        type: 'confirm',
        name: 'fullNameOk',
        message: 'Does the project name "' + fullName + '" look ok?'
    }], function(okAnswer) {
        if (!okAnswer.fullNameOk) {
            /*eslint-disable */
            return usernameComponentNamePrompt(cb);
            /*eslint-enable */
        }
        return cb();
    });
}

function componentNamePrompt(cb) {
    inquirer.prompt([{
        type: 'input',
        name: 'componentName',
        message: 'What will your component\'s name be (e.g. "hello-world")?:'
    }], function(componentNameAnswer) {
        if (!VALID_COMPONENT_NAME_REGEXP.test(componentNameAnswer.componentName)) {
            console.log('Component names may only contain lowercase letters, hyphens, and colons');
            return componentNamePrompt(cb);
        }
        return cb(componentNameAnswer.componentName);
    });
}

function usernamePrompt(cb) {
    inquirer.prompt([{
        type: 'input',
        name: 'username',
        message: 'What is your username (e.g. "jon-doe")?: '
    }], function(usernameAnswer) {
        if (!VALID_USERNAME_REGEXP.test(usernameAnswer.username)) {
            console.log('Usernames may only contain lowercase letters and hyphens');
            return usernamePrompt(cb);
        }
        return cb(usernameAnswer.username);
    });
}

function usernameComponentNamePrompt(loginData, cb) {
    // TODO: Need to verify that the username matches
    // the username of the user we just authenticated,
    // or to automatically retrieve it and then verify
    // that that is the username the user wants to use.
    usernamePrompt(function(username) {
        componentNamePrompt(function(componentName) {
            nameOkPrompt(username, componentName, function() {
                return cb({
                    username: username,
                    email: loginData.user.email,
                    authToken: loginData.authentication_token,
                    componentName: componentName
                });
            });
        });
    });
}

function scaffoldFramework() {
    console.log(chalk.yellow('Before scaffolding a framework project, you will need to have'));
    console.log(chalk.yellow('already registered a Famous account (command: `$ famous register`).'));
    console.log(chalk.yellow('Once registered, you can enter your info into the prompts below.'));

    async.waterfall([loginFlow, login], function(error, loginData) {
        if (error) {
            var message = famouserror.message(error, loginData);
            if (message) {
                return console.log(message);
            }
        }

        usernameComponentNamePrompt(loginData, function(answers) {
            createScaffold(answers, function() {
                console.log(chalk.green('Created framework scaffold in current working directory!'));
                console.log('To start up development, first run:');
                console.log('  ', chalk.magenta('$ npm install && npm run dev'));
                console.log('Then browse to', chalk.underline('http://localhost:1618'));
            });
        });
    });
}

module.exports = scaffoldFramework;
