'use strict';

var object = {};

object.shallowMerge = function shallowMerge(obj1, obj2) {
    for (var key in obj2) { obj1[key] = obj2[key]; }
    return obj1;
};

module.exports = object;
