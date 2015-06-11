'use strict';

var waterfallPipeDecorator = function(fn) {
    var waterfallFn = function(data, callback) {
        if (!callback) {
            callback = data;
            data = {};
        }
        fn(function(error, results) {
            if (error) {
                return callback (error, results);
            } else if (results) {
                for (var key in results) {
                    data[key] = results[key];
                }
                return callback(error, data);
            } else {
                return callback(error, data);
            }
        })
    };
    return waterfallFn;
};

module.exports = waterfallPipeDecorator;
