#!/usr/bin/env node
'use strict';

var program = require('commander');
var develop = require('../lib/dev/dev');
var metrics = require('../lib/metrics/mixpanel');
var create = require('../lib/project/create');
var init = require('../lib/project/init');
var login = require('../lib/user/login');
var logout = require('../lib/user/logout');
var userGet = require('../lib/user/get');
var storage = require('../res/sdk-bundle').storage;
var set = require('../lib/config/set');
var auto = require('../lib/autoupdate');
var scaffoldFramework = require('../lib/framework/scaffold');

storage.getGlobal(function(error, config){
    if (config.tracking) {
        metrics.track('cli-event', {'command_data': process.argv.slice(2, process.argv.length).join(' ') || 'help'}, function(){});
    }
});

auto(function(){
    program
        .version(require('../package.json').version)
        .option('-v, --version', 'output the version number')
        .option('--loglevel <level>', 'output the version number');

    program
        .command('login')
        .description('login with Famous Cloud Services.')
        .action(login);

    program
        .command('logout')
        .description('logout from Famous Cloud Services.')
        .action(logout);

    program
        .command('create')
        .description('create a famous project')
        .option('-n, --name', 'Name your project')
        .action(create);

    program
        .command('init')
        .description('init a famous seed repo')
        .option('-n, --name', 'Name your seed repo')
        .action(init);

    program
        .command('develop')
        .alias('dev')
        .description('run your famous project')
        .action(develop);

    program
        .command('whoami')
        .alias('session')
        .description('retrieve user session data')
        .action(userGet);

    program
        .command('set')
        .option('--devmode [state]', 'set famous cli development  mode')
        .option('--tracking [state]', 'set famous cli tracking mode')
        .description('set Famous-CLI modes and config')
        .action(set);

    program
        .command('framework-scaffold')
        .description('scaffold a new framework component')
        .action(scaffoldFramework);

    program
        .parse(process.argv);

    if (program.loglevel) {
        var loglevel = program.loglevel;
        if (loglevel === 1 || loglevel === 'verbose') {
            process.env.FAMOUS_CLI_LOG_LEVEL = 1;
        } else if (loglevel === 2 || loglevel === 'debug') {
            process.env.FAMOUS_CLI_LOG_LEVEL = 2;
        } else {
            process.env.FAMOUS_CLI_LOG_LEVEL = 0;
        }
    }

    if (program.args.length === 0) {
        program.help();
    }
});
