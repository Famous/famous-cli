'use strict';

var uuid = require('uuid');

/**
 *
 */
var generateUsername = function () {
    var userId = 'famo-';

    userId = userId + uuid.v4();

    return userId;
};

/**
 *
 */
var generatePassword = function () {
    var password;

    password = uuid.v1();

    return password;
};

/**
 *
 */
var generateEmail = function (username) {
    var username = username || generateUsername();

    username = username + '@ghost.famo.us';

    return username;
};

/**
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
