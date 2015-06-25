'use strict';

var chalk = require('chalk');


/**
 */
var FamousCLIError = {
    /**
     * message
     *  process an error into a human readable message
     * @param {object} error to parse into a message
     */
    message: function (error, data) {
        if (!error) {
            return null;
        }

        if (error.code === 'ECONNRESET') {
            return chalk.bold('Famous ') + 'Server Error. Somebody poke dev-ops with a stick.';
        } else if (error.message === 'passwords-not-matching') {
            return chalk.bold.red('Passwords must match');
        } else if (error.message === 'invalid-username') {
            return chalk.bold.red('Usernames can only containe alphanumeric lowercase characters, hyphens, and underscores');
        } else if (data) {
            if (data.status >= 400 && data.errors) {
                var message = chalk.bold('\n\r');
                data.errors.forEach(function(current) {
                    message += chalk.red(current) + '\n\r';
                });
                return message;
            }
        } else {
            return chalk.bold('Famous CLI error, contact support.');
        }
    }
};

/** **/
module.exports = FamousCLIError;

