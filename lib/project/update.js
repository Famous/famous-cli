'use strict';

var push = require('../widget/push');

/** **/
module.exports = push;

'use strict';

var readdir = require('recursive-readdir');
var async = require('async');
var mime = require('mime');
var path = require('path');
var chalk = require('chalk');
var famouserror = require('../error');

var widgetPush = require('../../res/sdk-bundle.js').widget.push;
var getProjectMeta = require('../../res/sdk-bundle.js').storage.getProjectMeta;
var config = require('../../res/sdk-bundle.js').config;


/**
 * pushCLI
 *
 */
var pushCLI = function(callback) {
    var manifest = [];

    async.waterfall([
        // Fetch the current directory
        function(callback) {
            var workspace = path.join(process.cwd(), 'public');
            callback(null, workspace);
        },
        // Rescursive lookup to find all files
        function(p, callback) {
            readdir(p, function (err, files) {
                return callback(err, files);
            });
        },
        // Turn the files into a manifest object
        function(files, callback) {
            files.forEach(function(current) {
                var relative = current.replace(path.join(process.cwd(), 'public'), '');
                var contentType = mime.lookup(current);
                var baseName = path.basename(current);
                manifest.push({
                    value: current,
                    relative: relative,
                    options: {
                        filename: baseName,
                        contentType: contentType
                    }
                });
            });
            return callback(null, { manifest: manifest });
        },
        // Fetch Container-id and Widget-id
        function(config, callback) {
            getProjectMeta(function(error, data) {
                // @TODO handle error case where we don't have a widget_id
                var meta = data;
                config.widgetId = meta.widget_id;
                return callback(error, config);
            });
        },
        // Push
        function(config, callback) {
            widgetPush(config.widgetId, config.manifest, function(err, data) {
                return callback(err, data);
            });
        }
    ],

    function (err, data) {
        if (err) {
            var message = famouserror.message(err, data);
            if (message) {
                console.log(message);
                process.exit(1);
            }
            return;
        }
        getProjectMeta(function(error, results) {
            var metaData = results;
            var container_id = metaData.container_id;
            console.log(chalk.yellow('Share: https://' + config.hostname + '/codemanager/v1/containers/' + container_id + '/share' ));
            console.log(chalk.cyan('Embed:' + '\n' + '<script src="https://' + config['assets-hostname'] + '/embed/embed.js"></script>' + '\n' + '<div class="famous-container" data-famous-container-identifier="' + container_id + '">'));

        });

        if (typeof callback == 'function') return callback(err, data);
    });
};

/** **/
module.exports = pushCLI;

