var test = require('tap').test;
var sinon = require('sinon');
var rewire = require('rewire');
var spawn = require('child_process').spawn;


test(function(t) {
    t.plan(2);

    t.test(function(t) {
        var child = spawn('../../bin/index.js', ['fubfub']);

        t.plan(1);

        child.stdout.on('data', function (data) {
            var data = new String(data);

            t.ok(data.match(/Usage:.*/), "unrecognized subcommand should output help");
        });
    });

    t.test(function(t) {
        var child = spawn('../../bin/index.js');

        t.plan(12);

        child.stdout.on('data', function (data) {
            var data = new String(data);
            t.ok(data.match(/Usage:.*/), "famous should output usage info");
            t.ok(data.match(/Commands:.*/), "famous should output commands info");
            t.ok(data.match(/Options:.*/), "famous should output Options info");

            t.ok(data.match(/user <cmd>\ .*/), "famous should output user command info");
            t.ok(data.match(/container <cmd>\ .*/), "famous should output container command info");
            t.ok(data.match(/widget <cmd>\ .*/), "famous should output widget command info");
            t.ok(data.match(/project <cmd>\ .*/), "famous should output project command info");
            t.ok(data.match(/register\ .*/), "famous should output register command info");
            t.ok(data.match(/login\ .*/), "famous should output login command info");  
            t.ok(data.match(/init \[options\]\ .*/), "famous should output init command info");
            t.ok(data.match(/help \[cmd\]\ .*/), "famous should output help command info");
            
            t.ok(data.match(/-h, --help\ .*/), "famous should output help options info");
        });
    });
});

