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
        function(cb) {
            cb(null, path.join(process.cwd(), '/public');
        },
        // Rescursive lookup to find all files
        function(p, cb) {
            readdir(p, function (err, files) {
                return cb(err, files);
            });
        },
        // Turn the files into a manifest object
        function(files, cb) {
            files.forEach(function(current) {
                var contentType = mime.lookup(current);
                var baseName = path.basename(current);
                manifest.push({
                    value: current,
                    options: {
                        filename: baseName,
                        contentType: contentType
                    }
                });
            });
            return cb(null, { manifest: manifest });
        },
        // Fetch Container-id and Widget-id
        function(conf, cb) {
            getProjectMeta(function(error, data) {
                // @TODO handle error case where we don't have a widget_id
                var meta = data;
                conf.widgetId = meta.widget_id;
                return cb(error, conf);
            });
        },
        // Push
        function(conf, cb) {
            widgetPush(conf.widgetId, conf.manifest, function(err, data) {
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

