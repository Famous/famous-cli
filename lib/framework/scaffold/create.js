'use strict';

var async = require('async');
var famouserror = require('../../error');
var fs = require('fs-extra');
var mustache = require('mustache');
var path = require('path');

var TPL_DIR = path.join(__dirname, 'templates');

function createComponentDir(dir, cb) {
    fs.mkdirp(dir, function(err) {
        if (err) {
            var message = famouserror.message(err);
            if (message) {
                return console.log(message);
            }
        }
        return cb();
    });
}

function buildTemplates(info, cb) {
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

function writeDoc(doc, cb) {
    fs.writeFile(doc.path, doc.content, cb);
}

function createScaffold(info, cb) {
    var fullName = info.username + ':' + info.componentName;
    var componentSegments = fullName.split(':');
    var componentEntrypointName = componentSegments[componentSegments.length - 1];
    var componentRelativePath = componentSegments.join(path.sep);
    var componentAbsolutePath = path.join(process.cwd(), componentRelativePath);

    var tplInfo = {
        componentName: fullName,
        componentNameHyphenated: fullName.split(':').join('-'),
        componentPath: componentRelativePath
    };

    createComponentDir(componentAbsolutePath, function() {
        fs.mkdirp(path.join(process.cwd(), 'public'), function() {
            buildTemplates(tplInfo, function(err, docData) {
                if (err) {
                    console.error(err);
                    return;
                }
                var docDataToWrite = docData.map(function(doc) {
                    if (doc.path === '_entrypoint.js') {
                        doc.path = path.join(componentAbsolutePath, componentEntrypointName + '.js');
                    }
                    else if (doc.path === '_gitignore') {
                        doc.path = path.join(process.cwd(), '.gitignore');
                    }
                    else if (doc.path === '_index.html') {
                        doc.path = path.join(process.cwd(), 'public', 'index.html');
                    }
                    else {
                        doc.path = path.join(process.cwd(), doc.path.replace(/^_/, ''));
                    }
                    return doc;
                });

                async.each(docDataToWrite, writeDoc, function() {
                    return cb();
                });
            });
        });
    });
}

module.exports = createScaffold;
