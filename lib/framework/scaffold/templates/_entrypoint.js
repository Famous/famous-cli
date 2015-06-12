FamousFramework.scene('{{componentName}}', {
    behaviors: {
        '#surface': {
            'content': '<h1>Hello {{componentName}}!</h1>',
            'size': [200, 200],
            'style': {
                'background-color': 'red'
            }
        }
    },

    tree: '<node id="surface"></node>'
});
