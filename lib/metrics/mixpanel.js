'use strict';

var mixpanelId = 'ba222c5ac04034fb6ba2fbd89b6c1f79';
var mixpanel = require('mixpanel').init(mixpanelId);
var storage = require('../../res/sdk-bundle.js').storage;
var crypto = require('crypto');
var pjson = require('../../package.json');

/**
 * setTracking
 *
 * Sets the anonymous tracking id for mixpanel.
 */

exports.setTracking = function setTracking(tracking, cb) {
    if (tracking) {
        var seed = Math.floor(Date.now() * Math.random()).toString();
        var unique_id = crypto.createHash('sha256').update(seed).digest('base64');
        storage.setGlobal({'tracking': true, 'mixpanel_id': unique_id}, cb);
    } else {
        storage.setGlobal({'tracking': false}, cb);
        exports.track('opt-out');
    }
};

/**
 * getTracking
 *
 * Checks the status of the tracking config.
 */
exports.getTracking = function getTracking() {
    storage.getGlobal(function(error, config) {
        if (config.tracking === true && !config.devmode) {
            return config.mixpanel_id;
        } else {
            return false;
        }
    });
};

/**
 * track
 *
 * Record CLI usage data to mixpanel.
 */
exports.track = function track(event, data, cb) {
    if (typeof cb !== 'function') {
        cb = function () {};
    }

    if (data === undefined) {
        data = {};
    }

    storage.getGlobal(function(error, config) {
        if (data instanceof Function) {
            cb = data;
            data = {};
        }

        if (config.tracking) {
            data.timestamp = new Date().toISOString();
            data.os = process.platform;
            data.node_version = process.version;
            data.cli_version = pjson.version;
            data.distinct_id = config.mixpanel_id;
            mixpanel.track(event, data, cb);
        }
        else {
            cb(new Error('User has not opted into tracking. Aborting ...'));
        }
    });
};
