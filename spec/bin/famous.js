var tap = require('tap');
var sinon = require('sinon');
var rewire = require('rewire');
var exec = require('child_process').exec;


tap.test(function(t) {
    t.plan(2);

    t.test(function(t) {
        t.plan(3);
        exec('node bin/famous.js', ['fubfub'], function(error, stdout, stderr) {
            t.ok(stdout.match(/Usage:.*/), "unrecognized subcommand should output help");
            t.ok(!error, "unrecognized subcommand should output help");
            t.ok(!stderr, "unrecognized subcommand should output help");
        });


    });

    t.test(function(t) {
        t.plan(10);

        exec('node bin/famous.js', function(error, stdout, stderr) {
            t.ok(stdout.match(/Usage:.*/), "famous should output usage info");
            t.ok(stdout.match(/Commands:.*/), "famous should output commands info");
            t.ok(stdout.match(/Options:.*/), "famous should output Options info");
            t.ok(stdout.match(/login\ .*/), "famous should output login command info");  
            t.ok(stdout.match(/create|init [options] \ .*/), "famous should output create|init command info");
            t.ok(stdout.match(/develop|dev\ .*/), "famous should output develop|dev command info");
            t.ok(stdout.match(/init \[options\]\ .*/), "famous should output init command info");
            t.ok(stdout.match(/-h, --help\ .*/), "famous should output help options info");
        
            t.ok(!error, "unrecognized subcommand should output help");
            t.ok(!stderr, "unrecognized subcommand should output help");
        });
    });
});

