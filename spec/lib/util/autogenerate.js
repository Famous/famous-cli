var tap = require('tap');
var rewire = require('rewire');
var path = require('path')

var auto = rewire('../../../lib/util/autogenerate');

tap.test(function(t) {
    t.plan(10);

    t.type(auto, 'object', "autogenerate should export a function");
    t.type(auto.generateUsername, 'function', "autogenerate should export a generateUserName function");
    t.type(auto.generateEmail, 'function', "autogenerate should export a generateEmail function");
    t.type(auto.generatePassword, 'function', "autogenerate should export a generatePassword function");
    t.type(auto.generateProjectName, 'function', "autogenerate should export a generateProjectName function");

    t.test('generateUsername', function(t) {
        t.plan(2);

        var username = auto.generateUsername();

        t.ok(username, "generateUserName should return something");
        t.type(username, 'string', "generateUserName should return a string");
    });

    t.test('generatePassword', function(t) {
        t.plan(2);

        var password = auto.generatePassword();

        t.ok(password, "generateUserName should return something");
        t.type(password, 'string', "generateUserName should return a string");
    });

    t.test('generateEmail', function(t) {
        t.plan(4);

        var email = auto.generateEmail();

        t.ok(email, "generateEmail should return something");
        t.type(email, 'string', "generateEmail should return a string");
        t.ok(email.indexOf('@') > -1, "generateEmail should return a properly formatted email address");
        t.ok(email.indexOf('@ghost.famo.us') > -1, "generateEmail should return a properly formatted email address with ghost account string");
    });

    t.test('generateEmail with args', function(t) {
        t.plan(5);

        var base = "flanpan";
        var email = auto.generateEmail(base);

        t.ok(email, "generateEmail should return something");
        t.type(email, 'string', "generateEmail should return a string");
        t.ok(email.indexOf('@') > -1, "generateEmail should return a properly formatted email address");
        t.equal(email.indexOf(base), 0, "generateEmail should return a properly formatted email address incorporating the provided base");
        t.ok(email.indexOf('@ghost.famo.us') > -1, "generateEmail should return a properly formatted email address with ghost account string");
   });

    t.test('generateProjectName', function(t) {
        t.plan(3);

        var projectName = auto.generateProjectName();

        t.ok(projectName);
        t.type(projectName, 'string');
        t.ok(projectName.indexOf('famous-seed-') > -1);
    });
});
