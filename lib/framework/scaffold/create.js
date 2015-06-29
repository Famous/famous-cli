'use strict';

var async = require('async');
var fs = require('fs-extra');
var mustache = require('mustache');
var path = require('path');

var TPL_DIR = path.join(__dirname, 'templates');
var COMPONENT_DELIMITER = ':';
var BINARY_ASSETS = { '_favicon.ico': true };

function loadTemplates(info, cb) {
    fs.readdir(path.join(TPL_DIR), function(dirErr, dirEntries) {
        var dirEntriesAbs = dirEntries.map(function(entry) {
            return path.join(TPL_DIR, entry);
        });

        async.map(dirEntriesAbs, fs.readFile, function(fileReadErr, filesData) {
            var finishedTemplates = filesData.map(function(fileData, fileIdx) {
                var filePath = dirEntries[fileIdx];

                if (filePath in BINARY_ASSETS) {
                    return {
                        path: filePath,
                        content: fileData
                    };
                }
                else {
                    var fileStrOrig = fileData.toString();
                    var fileStrFinal = mustache.render(fileStrOrig, info);

                    return {
                        path: filePath,
                        content: fileStrFinal
                    };
                }
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

        if (origPath in BINARY_ASSETS) {
            fs.writeFile(destPath, doc.content, cb);
        }
        else {
            fs.writeFile(destPath, doc.content, cb);
        }
    }, finish);
}

function createScaffold(info, cb) {
    var fullName = info.username + COMPONENT_DELIMITER + info.componentName;
    var componentSegments = fullName.split(COMPONENT_DELIMITER);
    var componentEntrypointName = componentSegments[componentSegments.length - 1];
    var componentSubdir = componentSegments.slice(1, componentSegments.length).join(path.sep);

    var tplInfo = {
        componentName: fullName,
        componentLocalURL: 'build/' + fullName.split(COMPONENT_DELIMITER).join('~'),
        componentNameHyphenated: fullName.split(COMPONENT_DELIMITER).join('-')
    };

    loadTemplates(tplInfo, function(loadTemplatesErr, docs) {
        if (loadTemplatesErr) {
            return cb(loadTemplatesErr);
        }
        makeSubDirs([
            'public',
            path.join('components', info.username, componentSubdir),
            path.join('components', 'famous')
        ], function(makeSubDirsErr) {
            if (makeSubDirsErr) {
                return cb(makeSubDirsErr);
            }
            writeTemplates(docs, [
                ['_entrypoint.js', path.join('components', info.username, componentSubdir, componentEntrypointName + '.js')],
                ['_favicon.ico', path.join('public', 'favicon.ico')],
                ['_gitignore', '.gitignore'],
                ['_index.html', path.join('public', 'index.html')],
                ['_package.json', 'package.json'],
                ['_README.md', 'README.md']
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
