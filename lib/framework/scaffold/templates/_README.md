# {{componentName}}

A Famous Framework component

- - - -

## Setup

First install the required packages:

    $ npm install

Then start up the local development server:

    $ npm run dev

Then surf to [localhost:1618](http://localhost:1618) ...

## Deploying

Take a snapshot of your component:

    $ npm run snapshot-component -- -n jon-doe:my-component

Then use the Famous CLI to push your component to a container:

    $ famous deploy public/jon-doe:my-component
