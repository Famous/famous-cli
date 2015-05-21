var test = require('tap').test;
var sinon = require('sinon');
var rewire = require('rewire');
var spawn = require('child_process').spawn;


test(function(t) {
    t.plan(2);

    t.test(function(t) {
        var child = spawn('../../bin/famous-project', ['flubwub']);

        t.plan(1);

        child.stdout.on('data', function (data) {
            var data = new String(data);
            t.ok(data.match(/Usage:.*/), "famous project should output usage info with unrecognized subcommand");
        });
    });

    t.test(function(t) {
        var child = spawn('../../bin/famous-project');

        t.plan(8);

        child.stdout.on('data', function (data) {
            var data = new String(data);
            t.ok(data.match(/Usage:.*/), "famous-project should output usage info");
            t.ok(data.match(/Commands:.*/), "famous-project should output commands info");
            t.ok(data.match(/create\ .*.*/), "famous-project should output command create info");
            t.ok(data.match(/get\ .*/), "famous-project should output command get info");
            t.ok(data.match(/update\ .*/), "famous-project should output command login info");
            t.ok(data.match(/share\ .*/), "famous-project should output command login info");
            t.ok(data.match(/Options:.*/), "famous-project should output Options info");
            t.ok(data.match(/-h, --help\ .*/), "famous-project should output command login info");
        });
    });
});

