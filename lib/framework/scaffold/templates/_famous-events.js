// Copyright (c) 2015 Famous Industries, Inc. All Rights Reserved
// 901c54f87d2ae41438ad1dbfd4cc92b5f98f9ec1
FamousFramework.module('famous:events', {
    events: {
        '$public': {
            '$miss': function($DOMElement, $famousNode, $payload) {
                var eventName = $payload.eventName;
                var listener = $payload.listener;

                $famousNode.addUIEvent(eventName);
                $DOMElement.on(eventName, function(event) {
                    listener(event);
                });
            },
            'size-change' : function($famousNode, $payload) {
                $famousNode.addComponent({
                    onSizeChange: function(size) {
                        $payload.listener(size);
                    }
                })
            },
            'parent-size-change' : function($famousNode, $payload) {
                $famousNode.addComponent({
                    onParentSizeChange: function(size) {
                        $payload.listener(size);
                    }
                })
            },
            'value': function($DOMElement, $famousNode, $payload) {
                var eventName = 'input';
                var listener = $payload.listener;

                $famousNode.addUIEvent(eventName);
                $DOMElement.on(eventName, function(event) {
                    listener(event);
                });
            }
        }
    }
})
.config({
    imports: {
        'famous:events': [] // prevent expansion of 'size-change' to 'famous:events:size-change'
    },
    extends: []
});
