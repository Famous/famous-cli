'use strict'

var setProjectMeta = require('../../res/sdk-bundle').storage.setProjectMeta;
var getProjectMeta = require('../../res/sdk-bundle').storage.getProjectMeta;
var createWidget = require('../../res/sdk-bundle').widget.create;
var createContainer = require('../../res/sdk-bundle').container.create;


var link = function(name, callback) {
    name = name || 'famous-seed';

    createWidget({name: 'famous-seed'}, function(error, res) {
        if (error) {
            callback(error);
        } else {
            var data = {name: res.block.name, block_id: res.block.id};
            createContainer(data, function(error, res) {
                var containerData = {
                    container_id: res.container.id,
                    container_name: res.container.name,
                    widget_name: res.container.name,
                    widget_id: res.container.block_id
                };
                setProjectMeta(containerData, function(er) {
                    if (er) {
                        console.log(er);
                    }
                    callback(null, containerData);
                });

            });
        }
    });
}

module.exports = link;
