'use strict';

var famouserror = require('../error');
var storage = require('../../res/sdk-bundle.js').storage;


/**
 * setData
 *  insures data is sanitized and set properly
 *
 * @param {object} - data - object to augment with setting
 * @param {string} - property - property to add to data
 * @param {boolean} - value - value to set, interpreted as boolean
 */
var setData = function(data, property, value) {
    if (value === 'true' || value === true) {
        data[property] = true;
    } else if (value === 'false') {
        data[property] = false;
    }

    return data;
};

/**
 * setConfig
 *
 * @param {object} object with option values to set
 * @return {undefined} returns falsy
 */
var setConfig = function(program) {
    var data = {};

    // return if no valid property to modify is attached
    if (!program.hasOwnProperty('devmode') && !program.hasOwnProperty('tracking')) {
        return;
    }

    if (program.hasOwnProperty('devmode')) {
        data = setData(data, 'devmode', program.devmode);
    }

    if (program.hasOwnProperty('tracking')) {
        data = setData(data, 'tracking', program.tracking);
    }

    storage.setGlobal(data, function(error) {
        var message = famouserror.message(error, data);
        if (message) {
            console.log(message);
            process.exit(1);
        }
    });

    return;
};

/** **/
module.exports = setConfig;

