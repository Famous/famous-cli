'use strict';

var getProjectMeta = require('../../res/sdk-bundle.js').storage.getProjectMeta;

/**
 *
 */
var getProject = function() {
	getProjectMeta(function(error, data) {
		if (!error && data) {
			console.log(data.widget_name);
			console.log(data.widget_id);
			console.log(data.container_name);
			console.log(data.container_id);
		} else {
			console.log('No widget associated with current repo');
		}
	});
};

/** **/
module.exports = getProject;

