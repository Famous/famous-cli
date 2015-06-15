'use strict';

var uuid = require('uuid');

/**
 * generateProjectName
 *
 * Generates a project name
 *
 */
var generateProjectName = function () {
    return 'famous-seed-' + uuid.v1();
};

/**
 * generateUsername
 *
 * Generates a famous ghost username
 *
 */
var generateUsername = function () {
    var userId = 'famo-';

    userId = userId + uuid.v4();

    return userId;
};

/**
 * generatePassword
 *
 * Generates a famous ghost password
 *
 */
var generatePassword = function () {
    var password;

    password = uuid.v1();

    return password;
};

/**
 * generateEmail
 *
 * Generates a famous ghost email
 *
 */
var generateEmail = function (username) {
    username = username || generateUsername();

    username = username + '@ghost.famo.us';

    return username;
};

/**
 * autogenerate
 *
 * Generates ghost user credentials for Hub Services.
 *
 */
var autogenerate = function (callback) {
    var username = generateUsername();
    var password = generatePassword();
    var email = generateEmail(username);

    callback(null, {username: username, password: password, email: email});
};

/** **/
module.exports.generate = autogenerate;
module.exports.generateUsername = generateUsername;
module.exports.generatePassword = generatePassword;
module.exports.generateEmail = generateEmail;
module.exports.generateProjectName = generateProjectName;
