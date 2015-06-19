# {{componentName}}

A Famous Framework component

- - - -

## Setup

First install the required packages:

    $ npm install

This step will also copy some core Famous components (e.g. `famous:core:node` and `famous:events` into your project's directory.)

Then start up the local development server:

    $ npm run dev

Then surf to [localhost:1618](http://localhost:1618) ...

## Deploying

Note: Before you can deploy your component, you must...

1.) Register for a Famous Hub account (`$ famous register`). You can skip this step if you've already done it before. If you aren't sure, check for a `.famous/.config` file in your home directory.

2.) Be working with a component whose namespace matches your username. I.e. if your component is `jon-doe:my-component`, then your username must be `jon-doe` exactly for the push to succeed.

Once you have this all set up, you are ready to deploy to a container!

First, save a snapshot of the desired component to deploy:

    $ npm run snapshot-component -- -n jon-doe:my-component

Then, use the Famous CLI to push to a container:

    $ famous deploy public/jon-doe:my-component
