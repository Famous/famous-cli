'use strict';

var https = require('https');

var getGlobal = require('../../res/sdk-bundle.js').storage.getGlobal;

var getUsername = function getUsername(callback) {

    getGlobal(function (error, session) {
        if (error) {
            console.log(chalk.bold('Famous ') + 'No user session detected');
            console.error(error);
            process.exit(1);
        }
        if (!session.authentication_token || !session.user) {
            console.log(chalk.bold('Famous ') + 'No user session detected');
            process.exit(1);
        }
        var options = {
            hostname: 'api-beta.famo.us',
            port: 443,
            path: '/auth/v1/users',
            method: 'GET',
            headers: {'X-Authentication-Token':  session.authentication_token}
        };

        var req = https.request(options, function(res) {
            var body = '';
            res.on('data', function(d) {
                body += d;
            });
            res.on('end', function() {
                callback(JSON.parse(body));
            });
        });
        req.end();

        req.on('error', function(e) {
            console.error(e);
        });
    });
};

module.exports = getUsername;