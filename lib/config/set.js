'use strict';

var inquirer = require('inquirer');
var async = require('async');
var famouserror = require('../error');
var storage = require('../../res/sdk-bundle.js').storage;

var setConfig = function() {
    var data = {'dev-mode':'true'};

    storage.setGlobal(data, function(error) {
        var message = famouserror.message(error, data);
        if (message) {
            console.log(message);
            process.exit(1);
        }
        return;
    });
};

/** **/
module.exports = setConfig;

