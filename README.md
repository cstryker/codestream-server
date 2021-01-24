# CodeStream Backend Services

On the backend (aka. the server-side), CodeStream runs a number of services to
provide all the functionality needed for the clients. Different configurations
are supported most natably the use of the broadcaster and rabbitMQ for On-Prem
vs. PubNub and AWS SQS for CodeStream Cloud. This repo contains all the code for
these services.

## Development Setup

_Note: CodeStream employees may prefer to use the dev_tools sandbox as it will
provide most of the ancillary resources you'll need. [Details
here](docs/codestream-sandbox-setup.md)._

### Prerequisites

1. Mac or Linux computer using zsh or bash.

1. Nodejs 12.14.1 with npm 6.13.4 (or compatibile)

1. [Docker Desktop](https://www.docker.com/products/docker-desktop) which we'll
   use to provide MongoDB and a pre-configured RabbitMQ.

If you do not wish to use docker, you'll need to provide both of these services:

1. MongoDB 3.4.9 with `mongodb://localhost/codestream` providing full access to
   create collections and indexes in the `codestream` database. If you're
   willing to run docker, the instructions below will show you how to install a
   MongoDB docker container.

1. RabbitMQ 3.7.x with the delayed message exchange plugin. You will need to
   create a codestream user with access. [Details here](api_server/docs/rabbitmq.md).

### Installation

1. Fork the
   [codestream-server](https://github.com/teamcodestream/codestream-server) repo
   and clone it.

1. Setup your shell's environment
   ```
   cd codestream-server
   source dev-env.sh
   ```

1. Install all the node modules
   ```
   npm run install-all
   ```

1. Install the rabbitmq docker container pre-configured for codestream (the
   container name will be csrabbitmq)
   ```
   docker run -d -p 5672:5672 -p 15672:15672 --name csrabbitmq teamcodestream/rabbitmq-onprem:0.0.0
   ```

1. Create a docker volume for mongo and launch the mongodb docker container.
   The docker volume will ensure the data persists beyond the lifespan of the
   container.
   ```
   docker run -d -P --name csmongo --mount 'type=volume,source=csmongodata,target=/data' mongo:3.4.9
   ```

1. In a separate shell, source in the `dev-env.sh` environment and start up the
   api service. It will repeatedly try to connect to the broadcaster. That's ok.
   Move on once you've started it.
   ```
   source dev-env.sh
   cd api_server
   bin/api_server --one_worker
   ```

1. In a another separate shell, source in the `dev-env.sh` environment and start
   up the broadcaster service.
   ```
   source dev-env.sh
   cd broadcaster
   bin/broadcaster --one_worker
   ```

1. If you want to use or work on the onprem admin UI, that will need two more
   shells. This first one will run webpack and rebuild the bundle file as your
   files change.
   ```
   source dev-env.sh
   cd onprem_admin
   npm run dev
   ```

1. This second one will launch the admin server and rebuild the SPA as your
   files change (via nodemon).
   ```
   source dev-env.sh
   cd onprem_admin
   npm run start
   ```

You should now be able to change your CodeStream extension settings to reference
http://localhost:xxxxx as your CodeStream API server at which point you can create an
account and go to town.

Develop to your heart's content!!!!  We _love_ pull-requests.
