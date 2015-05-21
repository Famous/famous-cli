'use strict';

var getProjectMeta = require('../../res/sdk-bundle.js').storage.getProjectMeta;

/**
 * getBlock;
 *  display metadata of the widget in the current project directory
 */
var getBlock = function() {
    getProjectMeta(function(error, data) {
        if (!error && data) {
            console.log(data.widget_name);
            console.log(data.widget_id);
        } else {
            console.log('No widget associated with current repo');
        }
    });
};

/** **/
module.exports = getBlock;

