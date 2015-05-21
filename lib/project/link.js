'use strict'

var setProjectMeta = require('../../res/sdk-bundle').storage.setProjectMeta;
var getProjectMeta = require('../../res/sdk-bundle').storage.getProjectMeta;
var createWidget = require('../../res/sdk-bundle').widget.create;
var createContainer = require('../../res/sdk-bundle').container.create;


var link = function(callback) {

    createWidget({name: 'famous-seed'}, function(error, res) {
        if (error) {
            callback(error);
        } else {
            var data = {name: res.block.name};
            data.block_id = res.block.id;
            setProjectMeta({'widget_id': res.block.id, 'widget_name': res.block.name}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            createContainer(data, function(error, res) {
                var containerData = {};
                containerData.container_id = res.container.id;
                containerData.container_name = res.container.name;
                setProjectMeta(containerData, function(er) {
                    if (er) {
                        console.log(er);
                    }
                    callback(null);
                });

            });
        }
    });
}

module.exports = link;
