'use strict';

var https = require('https');

var getGlobal = require('../../res/sdk-bundle.js').storage.getGlobal;

var getUsername = function getUsername(callback) {

    getGlobal(function (error, session) {
        if (error) {
            console.log('No user session detected, please register to deploy a framework component');
            return callback(error);
        }
        if (!session.authentication_token || !session.user) {
            console.log('No user session detected, please register to deploy a framework component');
            return callback('no-session');
        }
        var options = {
            hostname: 'api-beta.famo.us',
            port: 443,
            path: '/auth/v1/users',
            method: 'GET',
            headers: {'X-Authentication-Token': session.authentication_token}
        };

        var req = https.request(options, function(res) {
            var body = '';
            res.on('data', function(d) {
                body += d;
            });
            res.on('end', function() {
                callback(null, JSON.parse(body));
            });
        });
        req.end();

        req.on('error', function(e) {
            callback(e);
        });
    });
};

module.exports = getUsername;
