# famous-cli

The Famous Cloud Services Project is currently being deprecated.

All services which would allow project deployment or registration have been disabled. Please accept our deepest apologies for the inconvenience this may cause.

I would like to thank our users, contributers and supporters. Please reach out to us on the [famous community slack channel](http://slack.famous.org/) with comments and concerns. 

## Install the CLI

    $ npm install -g famous-cli

executing `$ famous` will display the default help string

## Create your first project

Famous seed projects can be created using the `$ famous create` command. You do not need to be logged in or registered with Hub services to create and develop famous projects.

    $ famous create

    $ famous create <seed-project-name>


## Develop your project

You can develop your seed project locally using `$ famous develop`. This will install dependencies, build your project and serve it on port 1618.

    $ famous develop

### Login

    $ famous login

and follow the prompts to login to your Famous Cloud Services user account. Note that if you ran `$ famous register` you are automatically logged in.

