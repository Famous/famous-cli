#!/usr/bin/env node
'use strict';

var program = require('commander');
var register = require('../lib/user/create');
var login = require('../lib/user/login');
var create = require('../lib/project/create');
var develop = require('../lib/dev/dev');
var userGet = require('../lib/user/get');
var deploy = require('../lib/deploy');
var metrics = require('../lib/metrics/mixpanel');
var storage = require('../res/sdk-bundle').storage;

var auto = require('../lib/autoupdate');

auto(function(){
program
  .version(require('../package').version);
  // .command('user <cmd>', 'famous hub user CLI')
  // .command('container <cmd>', 'famous hub container CLI')
  // .command('widget <cmd>', 'famous hub widget CLI')
  // .command('analytics <cmd>', 'famous hub analytics CLI')
  // .command('project <cmd>', 'famous hub project CLI');

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
  .alias('init')
  .description('create a famous project')
  .option('-n, --name', 'Name your project')
  .action(create);

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
  .command('session')
  .description('retrieve user session data')
  .action(userGet);

// program
//   .command('*')
//   .action(function(env) {
//     if (env !== 'project' && env !== 'user' && env !== 'widget') {
//         program.help();
//     }
//   });

 program
  .parse(process.argv);

storage.getGlobal(function(error, config){
    if (config.tracking) metrics.track('cli-event', {'command_data': program.args.slice(0, program.args.length - 1).join(" ")}, function(){});
});

if (program.args.length === 0) {
    program.help();
}
});
