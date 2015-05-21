'use strict';

var inquirer = require('inquirer');
var createWidget = require('../../res/sdk-bundle.js').widget.create;
var setProjectMeta = require('../../res/sdk-bundle.js').storage.setProjectMeta;

/**
 * Create
 *
 */
var Create = function() {
    var nameQuestion = {
        type: 'input',
        name: 'name',
        message: 'Widget name: '
    };

    inquirer.prompt([nameQuestion], function(widgetConfig) {
        widgetConfig.public = true;
        createWidget(widgetConfig, function(error, data) {
            if (error) {
                if (error.message === '401') {
                    console.log('Authorization Required for this operation, please $famous login or $famous register');
                }
                return;
            }
            setProjectMeta({'widget_id': data.block.id, 'widget_name': data.block.name}, function() {});
        });
    });
};

module.exports = Create;

