'use strict';

var setProjectMeta = require('../../res/sdk-bundle').storage.setProjectMeta;
var createWidget = require('../../res/sdk-bundle').widget.create;
var createContainer = require('../../res/sdk-bundle').container.create;
var auto = require('./../util/autogenerate');


var link = function(name, callback) {
    name = name || auto.generateProjectName();

    createWidget({name: name}, function(error, response) {
        if (error) {
            callback(error);
        } else {
            var data = {name: response.block.name, block_id: response.block.id};
            createContainer(data, function(err, res) {
                if (err) {
                    callback(err);
                }
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
};

module.exports = link;
