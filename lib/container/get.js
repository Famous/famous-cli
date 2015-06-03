'use strict';

var getProjectMeta = require('../../res/sdk-bundle.js').storage.getProjectMeta;

/**
 * getContainer
 *
 * Logs the current directories container information.
 */
var getContainer = function() {
    getProjectMeta(function(error, data) {
        if (!error && data) {
            console.log(data.container_name);
            console.log(data.container_id);
        } else {
            console.log('No container associated with current repo');
        }
    });
};

/** **/
module.exports = getContainer;
