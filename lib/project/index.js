'use strict';

var chalk = require('chalk');

var container = require('../../res/sdk-bundle.js').container;
var config = require('../../res/sdk-bundle.js').config;
var famouserror = require('../error');

/**
 * indexWidgets
 */
var indexProjects = function() {
    container.index(function(error, data) {
        if (error) {
            var message = famouserror.message(error, data);
            if (message) {
                console.log(message);
                process.exit(1);
            }
            return;
        }
        data.containers.forEach(function(index) {
            console.log(chalk.bold('\n' + 'Container - ') + index.name + ' (' + index.id + ')');
            console.log(chalk.yellow('Sharable link: ', 'https://' + config.hostname + '/codemanager/v1/containers/' + index.id + '/share' ));
            console.log(chalk.cyan('Embeddable html: ' + '\n\n' + '<script src="https://' + config['assets-hostname'] + '/embed/embed.js"></script>' + '\n' + '<div class="famous-container" data-famous-container-identifier="' + index.id + '">'));
        });
    });
};

/** **/
module.exports = indexProjects;

