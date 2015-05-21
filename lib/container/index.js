'use strict';

var container = require('../../res/sdk-bundle.js').container;

/**
 * indexContainers
 */
var indexContainers = function() {
    container.index(function(error, data) {
        if (error) {
            if (error.message === '401') {
                console.log('Authorization Required for this operation, please $famous login or $famous register');
            }
            return;
        }
        console.log(data);
        return;
    });
};

/** **/
module.exports = indexContainers;

