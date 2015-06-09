#!/usr/bin/env node
'use strict';

var program = require('commander');
var register = require('../lib/user/create');
var login = require('../lib/user/login');
var create = require('../lib/project/create');
var init = require('../lib/project/init');
var fork = require('../lib/project/fork');
var develop = require('../lib/dev/dev');
var userGet = require('../lib/user/get');
var deploy = require('../lib/deploy');
var metrics = require('../lib/metrics/mixpanel');
var storage = require('../res/sdk-bundle').storage;
var set = require('../lib/config/set');
var auto = require('../lib/autoupdate');

storage.getGlobal(function(error, config){
    if (config.tracking) {
        metrics.track('cli-event', {'command_data': process.argv.slice(2, process.argv.length).join(' ') || 'help'}, function(){});
    }
});

auto(function(){
    program
        .version(require('../package.json').version)
        .option('-v, --version', 'output the version number');

    program
        .command('register')
        .description('register with Famous Cloud Services.')
        .action(register);

    program
        .command('login')
        .description('login with Famous Cloud Services.')
        .action(login);

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
        .command('fork')
        .description('fork a famous project')
        .option('-n, --name', 'Name of forked project')
        .action(fork);

    program
        .command('develop')
        .alias('dev')
        .description('run your famous project')
        .action(develop);

    program
        .command('deploy')
        .description('deploy a famous project')
        .action(deploy);

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
        .parse(process.argv);

    if (program.args.length === 0) {
        program.help();
    }
});
