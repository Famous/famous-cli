'use strict';

var chalk = require('chalk');

var metrics = require('../metrics/mixpanel.js');
var storage = require('../../res/sdk-bundle.js').storage;

/**
 * tosCheck
 *  asks a user to agree to the Famous Cloud Services TOS
 */
var tosCheck = function(callback) {
    console.log(chalk.bold.blue("By using the famous CLI, you agree to the Famous Cloud Services TOS, viewable at 'http://famous.org/terms.html'"));
    storage.setGlobal({tos: true}, function(){
        return metrics.setTracking(true, callback);
    });
};


/** **/
module.exports = tosCheck;
