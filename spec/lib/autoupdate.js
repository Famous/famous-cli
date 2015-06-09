var test = require('tap').test;
var sinon = require('sinon');
var rewire = require('rewire');

var autoupdate = rewire('../../lib/autoupdate');

var data = "['1.0.0', '1.0.1', '1.0.2']";

var child_stub = {
    stdout: {
        on: sinon.stub().callsArgWith(1, data)
    },
    on: sinon.stub().callsArgWith(1, 0)
};
var spawn_stub = function () {
    return child_stub;
};


autoupdate.__set__('spawn', spawn_stub);
autoupdate.__set__('pkg', {"version": "1.0.1"});


test(function(t) {

    t.plan(5);

    t.type(autoupdate, 'function', 'autoupdate module should export a function');

    t.test(function(t) {
        t.plan(2);

        autoupdate.__set__('update', sinon.stub().callsArgWith(0, 0));
        var reset = autoupdate.__set__('checkTracking', sinon.stub().callsArgWith(0,null));

        autoupdate(function(code) {
            t.ok(true, "calling autoupdate should execute the provided callback");
            t.ok(!code, "autoupdate return code should match expectation (pass)");
            reset();
        });
    });

    t.test(function(t) {
        var update = autoupdate.__get__('update');
        t.plan(2);

        update(function(code) {
            t.ok(true, "calling autoupdate should execute the provided callback");
            t.equal(code, 0, "autoupdate return code should match expectation (pass)");
        });
    });


    // checktracking, returns garbage from global config
    t.test(function(t) {
        var autoupdate = rewire('../../lib/autoupdate');

        var storageMock = {
            getGlobal: sinon.stub().callsArgWith(0, null, null)
        }
        var tosCheckMock = sinon.stub().callsArgWith(0, null);

        var inquirerMock = {
            prompt: sinon.stub().callsArgWith(1, {tracking:false})
        }

        t.plan(3);

        autoupdate.__set__('storage', storageMock);
        autoupdate.__set__('tosCheck', tosCheckMock);
 
        checkTracking = autoupdate.__get__('checkTracking');
        checkTracking(function (error) {
            t.ok(true, "callback provided to autoupdate should be executed");
            t.ok(storageMock.getGlobal.called, "storage.getGlobal should be called as part of checkTracking");
            t.equal(error, null, "return value should be null in success case");
        }); 
    });
    // checktracking
    t.test(function(t) {
        var autoupdate = rewire('../../lib/autoupdate');

        var storageMock = {
            getGlobal: sinon.stub().callsArgWith(0, null, {})
        }
        var tosCheckMock = sinon.stub().callsArgWith(0, null);

        var inquirerMock = {
            prompt: sinon.stub().callsArgWith(1, {tracking:false})
        }

        t.plan(3);

        autoupdate.__set__('storage', storageMock);
        autoupdate.__set__('tosCheck', tosCheckMock);
 
        checkTracking = autoupdate.__get__('checkTracking');
        checkTracking(function (error) {
            t.ok(true, "callback provided to autoupdate should be executed");
            t.ok(storageMock.getGlobal.called, "storage.getGlobal should be called as part of checkTracking");
            t.equal(error, null, "return value should be null in success case");
        }); 
    });
});
