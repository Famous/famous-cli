var t = require('tap').test;
var rewire = require('rewire');
var path = require('path')

var file = rewire('../../../lib/util/file');

t('file', function(t) {
    t.plan(4);
    t.type(file, 'object', 'file must be an object');
    t.type(file.getTotalSizeInBytes, 'function', 'file.getTotalSizeInBytes must be a function');

    var filenames = [ path.resolve(__dirname, '../../../LICENSE.md') ];
    file.getTotalSizeInBytes(filenames, function(err, size) {
        t.equal(err, null, 'err must be null');
        t.equal(size, 1106, 'size must equals');
    });
});
