var test = require('tap').test;
var sinon = require('sinon');
var rewire = require('rewire');
var spawn = require('child_process').spawn;


test(function(t) {
    t.plan(2);

    t.test(function(t) {
        var child = spawn('../../bin/famous-user', ['flubwub']);

        t.plan(1);

        setTimeout(function(){
            t.end();
        }, 500);
 
        child.stdout.on('data', function (data) {
            var data = new String(data);
            t.ok(data.match(/Usage:.*/), "famous-user should ouput usage info on invalid subcommand");
        });
   });
 
    t.test(function(t) {
        var child = spawn('../../bin/famous-user');

        t.plan(7);

        child.stdout.on('data', function (data) {
            var data = new String(data);
            t.ok(data.match(/Usage:.*/), "famous-user should output usage info");
            t.ok(data.match(/Commands:.*/), "famous-user should output commands info");
            t.ok(data.match(/create\ .*.*/), "famous-user should output command create info");
            t.ok(data.match(/get\ .*/), "famous-user should output command get info");
            t.ok(data.match(/login\ .*/), "famous-user should output command login info");
            t.ok(data.match(/Options:.*/), "famous-user should output Options info");
            t.ok(data.match(/-h, --help\ .*/), "famous-user should output command login info");
        });
    });
});

