var test = require('tap').test;
var sinon = require('sinon');
var rewire = require('rewire');

var logging = rewire('../../../lib/logging/log');

test("famous cli logging module", function(t) {

    t.plan(7);

    t.type(logging.DEBUG, 'function', 'autoupdate module should export a function');
    t.type(logging.WARN, 'function', 'autoupdate module should export a function');
    t.type(logging.INFO, 'function', 'autoupdate module should export a function');

    t.test("log level defaults to 0", function(t) {
        var logmock = sinon.stub();
        t.plan(3);

        var reset = logging.__set__({
            console: {
                log: logmock
            }
        });

        logging.WARN('THIS IS A WARNING LOG');
        logging.INFO('THIS IS AN INFO LOG');
        logging.DEBUG('THIS IS A DEBUG LOG');

        t.ok(logmock.called, 'should output something by calling console.log');
        t.ok(logmock.calledOnce, 'should output something by calling console.log Once');
        t.equal(logmock.getCall(0).args[0], 'THIS IS A WARNING LOG', 'should only be called with a warning log');
        reset();
    });

    t.test("log level defaults to 0", function(t) {
        var logmock = sinon.stub();
        t.plan(3);

        var reset = logging.__set__({
            console: {
                log: logmock
            },
            LOG_LEVEL: 0
        });

        logging.WARN('THIS IS A WARNING LOG');
        logging.INFO('THIS IS AN INFO LOG');
        logging.DEBUG('THIS IS A DEBUG LOG');

        t.ok(logmock.called, 'should output something by calling console.log');
        t.ok(logmock.calledOnce, 'should output something by calling console.log Once');
        t.equal(logmock.getCall(0).args[0], 'THIS IS A WARNING LOG', 'should only be called with a warning log');
        reset();
    });

    t.test("log level 1", function(t) {
        var logmock = sinon.stub();
        t.plan(4);

        var reset = logging.__set__({
            console: {
                log: logmock
            },
            LOG_LEVEL: 1
        });

        logging.WARN('THIS IS A WARNING LOG');
        logging.INFO('THIS IS AN INFO LOG');
        logging.DEBUG('THIS IS A DEBUG LOG');

        t.ok(logmock.called, 'should output something by calling console.log');
        t.equal(logmock.callCount, 2, 'should output something by calling console.log Once');
        t.equal(logmock.getCall(0).args[0], 'THIS IS A WARNING LOG', 'should be called with a warning log');
        t.equal(logmock.getCall(1).args[0], 'THIS IS AN INFO LOG', 'should be called with an info log');
        reset();
    });

    t.test("log level 1", function(t) {
        var logmock = sinon.stub();
        t.plan(5);

        var reset = logging.__set__({
            console: {
                log: logmock
            },
            LOG_LEVEL: 2
        });

        logging.WARN('THIS IS A WARNING LOG');
        logging.INFO('THIS IS AN INFO LOG');
        logging.DEBUG('THIS IS A DEBUG LOG');

        t.ok(logmock.called, 'should output something by calling console.log');
        t.equal(logmock.callCount, 3, 'should output something by calling console.log Once');
        t.equal(logmock.getCall(0).args[0], 'THIS IS A WARNING LOG', 'should be called with a warning log');
        t.equal(logmock.getCall(1).args[0], 'THIS IS AN INFO LOG', 'should be called with an info log');
        t.equal(logmock.getCall(2).args[0], 'THIS IS A DEBUG LOG', 'should be called with a debug log');
        reset();
    });
});
