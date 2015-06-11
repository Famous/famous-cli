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
var file = require('../util/file');
var slash = require('slash');


/**
 * pushCLI
 *
 * Pushes the public directory of a seed project to the Hub cloud
 * and returns a share and embed link.
 *
 */
var pushCLI = function(options, callback) {

    async.waterfall([
        // Rescursive lookup to find all files
        function(cb) {
            readdir(options.directoryPath, function (err, files) {
                return cb(err, files);
            });
        },
        function(files, cb) {
            file.getTotalSizeInBytes(files, function(err, size) {
                if (err || size > 75000000) {
                    return cb(new Error('space-limt'), { status: 666, errors: ['Your project must be less than 75MB'] });
                }
                return cb(null, files);
            });
        },
        // Turn the files into a manifest object
        function(files, cb) {
            var manifest = [];
            files.forEach(function(current) {
                var relative = current.replace(options.directoryPath, '');
                var contentType = mime.lookup(current);
                var baseName = path.basename(current);
                manifest.push({
                    value: current,
                    relative: slash(relative),
                    options: {
                        filename: baseName,
                        contentType: contentType
                    }
                });
            });
            return cb(null, manifest);
        },
        // Push
        function(manifest, cb) {
            widgetPush(options.widget_id, manifest, function(err, data) {
                return cb(err, data);
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
        }
        getProjectMeta(function(error, results) {
            var metaData = results;
            var container_id = metaData.container_id;
            console.log(chalk.yellow('Share: https://' + config.hostname + '/codemanager/v1/containers/' + container_id + '/share' ));
            console.log(chalk.cyan('Embed:' + '\n' + '<script src="https://' + config['assets-hostname'] + '/embed/embed.js"></script>' + '\n' + '<div class="famous-container" data-famous-container-identifier="' + container_id + '"></div>'));

        });

        if (typeof callback === 'function') {
            return callback(err, data);
        }
    });
};

/** **/
module.exports = pushCLI;

