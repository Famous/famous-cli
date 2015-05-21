'use strict';

var mixpanelId = 'aa236a2f825da1074e3fca5ccac621e2';
var mixpanel = require('mixpanel').init(mixpanelId);
var storage = require('../../res/sdk-bundle.js').storage;
var crypto = require('crypto');
var os = require('os');
var pjson = require('../../package.json');


var setTracking = exports.setTracking = function setTracking(tracking, cb) {

    if (tracking) {
        var seed = Math.floor(Date.now() * Math.random()).toString();
        var unique_id = crypto.createHash('sha256').update(seed).digest('base64');
        storage.setGlobal({'tracking': true, 'mixpanel_id': unique_id}, cb);
    } else {
        storage.setGlobal({'tracking': false}, cb);
    }
};

exports.getTracking = function getTracking() {
    storage.getGlobal(function(error, config) {
        if (config.tracking === true) {
            return config.mixpanel_id;
        } else {
            return false;
        }
    });
};

exports.track = function track(event, data, cb) {
    var config = storage.getGlobal(function(error, config) {
        if (data instanceof Function) {
            cb = data;
            data = {};
        }

        if (config.tracking) {
            data.timestamp = new Date().toISOString();
            data.os = process.platform;
            data.node_version = process.version;
            data.famous_version = pjson.version;
            data.distinct_id = config.mixpanel_id;
            mixpanel.track(event, data, cb);
        }
        else {
            cb(new Error('User has not opted into tracking. Aborting ...'));
        }
    });
};
