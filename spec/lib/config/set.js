var tap = require('tap');
var rewire = require('rewire');
var sinon = require('sinon');
var path = require('path')

var set = rewire('../../../lib/config/set');

var storage_mock = {
    setGlobal: sinon.stub()
};

set.__set__('storage', storage_mock);

tap.test(function(t) {
    t.plan(2);

    t.type(set, 'function', "set should export a function");

    t.test('config set execution', function(t) {
        var data = {'devmode': false};

        t.plan(3);

        var result = set(data);

        t.ok(!result, "should return a falsy value");
        t.ok(storage_mock.setGlobal.called, "should call into famous sdk setGlobal");
        t.ok(storage_mock.setGlobal.calledOnce, "should call into famous sdk setGlobal once");
    });
});
