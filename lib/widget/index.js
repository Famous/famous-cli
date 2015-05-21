'use strict';

var widget = require('../../res/sdk-bundle.js').widget;

/**
 * indexWidgets
 */
var indexWidgets = function() {
    widget.index(function(error, data) {
        if (error) {
            if (error.message === '401' || error.message === '403') {
                console.log('Authorization Required for this operation, please $famous login or $famous register');
            }
            return;
        }
        console.log(data);
    });
};

/** **/
module.exports = indexWidgets;

