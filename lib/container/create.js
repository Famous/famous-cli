'use strict';

var inquirer = require('inquirer');
var async = require('async');
var createContainer = require('../../res/sdk-bundle.js').container.create;
var setProjectMeta = require('../../res/sdk-bundle.js').storage.setProjectMeta;

/**
 * createContainerCLI
 */
var createContainerCLI = function() {
    var nameQuestion = {
        type: 'input',
        name: 'name',
        message: 'Container name: '
    };

    var blockExistsQuestion = {
        type: 'confirm',
        name: 'block',
        message: 'Would you like to use the current widget assoiciated with this repo?'
    };

    var blockQuestion = {
        type: 'input',
        name: 'block',
        message: 'Widget to be associated: '
    };

    var prodQuestion = {
        type: 'confirm',
        name: 'productionMode',
        message: 'Is this container in production?'
    };

    async.waterfall([
        function(callback) {
            inquirer.prompt([nameQuestion, blockExistsQuestion, blockQuestion, prodQuestion], function (answers) {
//                answers.authToken = hub.get('hub-auth-token');
                if (answers.black === true) {
//                    answers.block = conf.get('block-id');
                }

                callback(null, answers);
            });
        },
        createContainer
    ],
    function (error, answers) {
        if (error) {
            console.log(error);
        } else {
            setProjectMeta({'container_id': answers.container.id, 'container_name': answers.container.name}, function() {});
            console.log('A Famous Container has been created with the id of: ', answers.container.id);
        }
    });
};

/** **/
module.exports = createContainerCLI;

