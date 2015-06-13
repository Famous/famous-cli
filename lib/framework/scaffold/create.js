'use strict';

var async = require('async');
var fs = require('fs-extra');
var mustache = require('mustache');
var path = require('path');

var TPL_DIR = path.join(__dirname, 'templates');
var COMPONENT_DELIMITER = ':';

function loadTemplates(info, cb) {
    fs.readdir(path.join(TPL_DIR), function(dirErr, dirEntries) {
        var dirEntriesAbs = dirEntries.map(function(entry) {
            return path.join(TPL_DIR, entry);
        });

        async.map(dirEntriesAbs, fs.readFile, function(fileReadErr, filesData) {
            var finishedTemplates = filesData.map(function(fileData, fileIdx) {
                var fileStrOrig = fileData.toString();
                var fileStrFinal = mustache.render(fileStrOrig, info);

                return {
                    path: dirEntries[fileIdx],
                    content: fileStrFinal
                };
            });

            cb(null, finishedTemplates);
        });
    });
}

function makeSubDirs(dirs, cb) {
    var fullDirs = dirs.map(function(dir) {
        return path.join(process.cwd(), dir);
    });

    async.each(fullDirs, fs.mkdirp, cb);
}

function findDoc(docs, pathToFind) {
    var found = null;
    docs.forEach(function(doc) {
        if (doc.path === pathToFind) {
            found = doc;
        }
    });
    return found;
}

function writeTemplates(docs, docPairs, finish) {
    async.each(docPairs, function(docPair, cb) {
        var origPath = docPair[0];
        var destPath = path.join(process.cwd(), docPair[1]);
        var doc = findDoc(docs, origPath);
        fs.writeFile(destPath, doc.content, cb);
    }, finish);
}

function createScaffold(info, cb) {
    var fullName = info.username + COMPONENT_DELIMITER + info.componentName;
    var componentSegments = fullName.split(COMPONENT_DELIMITER);
    var componentEntrypointName = componentSegments[componentSegments.length - 1];

    var tplInfo = {
        componentName: fullName,
        componentNameHyphenated: fullName.split(COMPONENT_DELIMITER).join('-')
    };

    loadTemplates(tplInfo, function(loadTemplatesErr, docs) {
        if (loadTemplatesErr) {
            return cb(loadTemplatesErr);
        }
        makeSubDirs([
            'public',
            path.join('components', info.username, componentEntrypointName),
            path.join('components', 'famous', 'core', 'node'),
            path.join('components', 'famous', 'events')
        ], function(makeSubDirsErr) {
            if (makeSubDirsErr) {
                return cb(makeSubDirsErr);
            }
            writeTemplates(docs, [
                ['_entrypoint.js', path.join('components', info.username, componentEntrypointName, componentEntrypointName + '.js')],
                ['_famous-core-node.js', path.join('components', 'famous', 'core', 'node', 'node.js')],
                ['_famous-events.js', path.join('components', 'famous', 'events', 'events.js')],
                ['_gitignore', path.join('.gitignore')],
                ['_index.html', path.join('public', 'index.html')],
                ['_package.json', path.join('package.json')],
                ['_README.md', path.join('README.md')]
            ], function(writeTemplatesErr) {
                if (writeTemplatesErr) {
                    return cb(writeTemplatesErr);
                }
                return cb();
            });
        });
    });
}

module.exports = createScaffold;
