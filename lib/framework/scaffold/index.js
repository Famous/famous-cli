'use strict';

var chalk = require('chalk');
var createScaffold = require('./create');
var fs = require('fs');
var inquirer = require('inquirer');
var getUsername = require('../../user/username');
var seedTools = require('../../util/seedTools');
var npm = require('../../util/npm');
var register = require('../../user/create').createUser;

var VALID_COMPONENT_NAME_REGEXP = /^[a-z\-\:]+$/;
var BLANK_REGEXP = /^\s+$/;
var EXISTING_FILES_WORTH_WARNING_ABOUT = {
    'README.md': true,
    'index.js': true,
    '.gitignore': true,
    'package.json': true
};

function createScaffoldWithAnswersAndLog(answers) {
    createScaffold(answers, function() {
        console.log(chalk.green('Created framework scaffold in current working directory!'));
        console.log('Installing npm dependencies and running setup tasks');
        npm.runHook('setup', function(){
            console.log('To start up development, first run:');
            console.log('  ', chalk.magenta('$ npm run dev'));
            console.log('Then browse to', chalk.underline('http://localhost:1618'));
        });
    });
}

function nameOkPrompt(username, componentName, cb) {
    var fullName = username + ':' + componentName;
    inquirer.prompt([{
        type: 'confirm',
        name: 'fullNameOk',
        message: 'Does the project name "' + fullName + '" look ok?'
    }], function(okAnswer) {
        if (!okAnswer.fullNameOk) {
            /*eslint-disable */
            return usernameComponentNamePrompt(createScaffoldWithAnswersAndLog);
            /*eslint-enable */
        }
        return cb();
    });
}

function componentNamePrompt(cb) {
    inquirer.prompt([{
        type: 'input',
        name: 'componentName',
        message: 'Enter your component\'s name (e.g. "hello-world"):'
    }], function(componentNameAnswer) {
        if (!componentNameAnswer.componentName || BLANK_REGEXP.test(componentNameAnswer.componentName)) {
            // Use the suggestion as the default in case nothing was entered
            componentNameAnswer.componentName = 'hello-world';
        }
        if (!VALID_COMPONENT_NAME_REGEXP.test(componentNameAnswer.componentName)) {
            console.log('Component names may only contain lowercase letters, hyphens, and colons');
            return componentNamePrompt(cb);
        }
        return cb(componentNameAnswer.componentName);
    });
}

function usernamePrompt(cb) {
    getUsername(function(error, data) {
        if (error) {
            register(function(err, config) {
                if (err) {
                    cb(err);
                }
                cb(config.user.username);
            });
        } else {
            cb(data.user.username);
        }
    });
}


function usernameComponentNamePrompt(cb) {
    // TODO: Need to verify that the username matches
    // the username of the user we just authenticated,
    // or to automatically retrieve it and then verify
    // that that is the username the user wants to use.
    usernamePrompt(function(username) {
        componentNamePrompt(function(componentName) {
            nameOkPrompt(username, componentName, function() {
                var projectName = username + ':' + componentName;
                seedTools.setHooks({'deploy-folder': 'public/build/' + projectName.split(':').join('~'), 'deploy': [], 'setup': [['install'], ['run', 'local-only-bootstrap', '--', '--watchAfterBuild=no']]}, function() {
                    return cb({
                        username: username,
                        componentName: componentName
                    });
                });
            });
        });
    });
}

// Before scaffolding in the current directory, let's first check to see
// if there are any files already present, and if so, at least warn the
// user before creating/overwriting a bunch of files
function checkForCleanDirectory(cb) {
    fs.readdir(process.cwd(), function(readdirErr, entries) {
        if (readdirErr) {
            return cb(readdirErr, false);
        }

        // If there aren't any entries, we're good to go
        if (!entries || entries.length < 1) {
            return cb(null, true);
        }

        var hasPreExistingFiles = false;
        for (var i = 0; i < entries.length; i++) {
            if (entries[i] in EXISTING_FILES_WORTH_WARNING_ABOUT) {
                hasPreExistingFiles = true;
            }
        }

        if (!hasPreExistingFiles) {
            return cb(null, true);
        }

        var warningMessage = [
            chalk.yellow('Warning: It looks like this directory already has some files in it.'),
            '  Scaffolding a project here may overwrite/modify your existing work.',
            '  If you\'ve already started a project here, this could cause problems.',
            '  Is it OK to scaffold a new project here anyway?'
        ];

        inquirer.prompt([{
            type: 'confirm',
            name: 'scaffoldingHereOk',
            message: warningMessage.join('\n')
        }], function(okAnswer) {
            if (!okAnswer.scaffoldingHereOk) {
                return cb(null, false);
            }

            return cb(null, true);
        });
    });
}

function scaffoldFramework() {
    checkForCleanDirectory(function(checkErr, doContinue) {
        if (checkErr) {
            return console.error('Unable to verify that this directory is OK to scaffold into. Exiting.');
        }

        if (!doContinue) {
            return console.log('Not going to scaffold after all. Exiting.');
        }

        usernameComponentNamePrompt(createScaffoldWithAnswersAndLog);
    });
}

module.exports = scaffoldFramework;
