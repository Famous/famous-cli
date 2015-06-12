# famous-cli

Famous Cloud Services Command Line Utility

register, manage user accounts, create, update and share projects


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

### Register with Famous Cloud Services

    $ famous register

Registering allows you to push your seed projects to the cloud.

### Login

    $ famous login

and follow the prompts to login to your Famous Cloud Services user account. Note that if you ran `$ famous register` you are automatically logged in.

### Deploy

Once you are logged in you can deploy your seed project to the cloud. `$ Famous deploy` builds your project and deploys it to a Hub container which is viewable by visiting the share link or embeddable using the returned HTML.

    $ famous deploy

