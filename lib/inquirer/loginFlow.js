'use strict';

var inquirer = require('inquirer');

/**
 * loginFlow
 *  prompt a user to input login information
 */
var loginFlow = function(callback) {
    var emailPrompt = {
        type: 'input',
        name: 'email',
        message: 'Email: '
    };

    var passwordPrompt = {
        type: 'password',
        name: 'password',
        message: 'Password: '
    };

    inquirer.prompt([emailPrompt, passwordPrompt], function(answers) {
        callback(null, answers);
    });
};


/** **/
module.exports = loginFlow;
