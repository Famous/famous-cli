'use strict';

var getGlobal = require('../../res/sdk-bundle.js').storage.getGlobal;
var chalk = require('chalk');

/**
 * getUser
 *   retrive locally stashed user information and pipe to stdout
 */
var getUser = function() {
    //TODO: remove
    var auto = require('../autoupdate');
    auto(function(){
        console.log('autoupdate finished');
    });


    getGlobal(function (error, session) {
        if (error) {
            console.log(chalk.bold('Famous ') + 'No user session detected');
            console.error(error);
            process.exit(1);
        }
        if (!session.authentication_token || !session.user) {
            console.log(chalk.bold('Famous ') + 'No user session detected');
            process.exit(1);
        }
        console.log(chalk.bold('Famous ') + 'Current User Session');
        console.log(chalk.bold('User: ') + session.user.email);
        console.log(chalk.bold('Token: ') + session.authentication_token);
        process.exit(0);
    });
};

/** **/
module.exports = getUser;

