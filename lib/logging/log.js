'use strict';

var LOG_LEVEL = process.env.FAMOUS_CLI_LOG_LEVEL || 0;

function WARN() { LOG_LEVEL >= 0 && console.log.apply(console, arguments); }
function INFO() { LOG_LEVEL >= 1 && console.log.apply(console, arguments); }
function DEBUG() { LOG_LEVEL >= 2 && console.log.apply(console, arguments); }

/* */
module.exports.WARN = WARN;
module.exports.INFO = INFO;
module.exports.DEBUG = DEBUG;
