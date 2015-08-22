# generator-express-sidecar [![Build Status](https://secure.travis-ci.org/jmnarloch/generator-express-sidecar.png?branch=master)](https://travis-ci.org/jmnarloch/generator-express-sidecar)

> [Yeoman](http://yeoman.io) [Express](http://expressjs.com) generator with additional [Spring Cloud Sidecar]() setup

The Spring Cloud Sidecar works in two ways it allows your Node application to be discovered by other applications,
perform health checks and configures Hystrix circut braker for fast failure. On other hands it let you access from
inside the Express application Eureka for service discovery or for instance Cloud Config server for configuration.

## Getting Started

To install generator from npm, run:

```bash
npm install -g generator-express-sidecar
```

Finally, initiate the generator:

```bash
yo express-sidecar
```

## Options

## Project structure

```
.
├── app
│   ├── app.js
│   ├── bin
│   ├── package.json
│   ├── public
│   ├── routes
│   └── views
└── sidecar
    ├── build.gradle
    ├── gradle
    ├── gradlew
    ├── gradlew.bat
    └── src
```

The `app` directory contains normal Express application, there is nothing special about it.
The `sidecar` has a Spring Cloud Sidecar setup.

## Running

You will need a running Spring Cloud Eureka instance to able to run this application.

First start the Express application:

```bash
$ cd app

$ bin/www

```

Next run Spring Cloud Sidecar

```bash

$ cd sidecar

$ ./gradlew bootRun

```

You should see the application being registered in Eureka:

![Eureka registration](https://github.com/jmnarloch/generator-express-sidecar/raw/master/eureka.png "Eureka registration")

You can access the sidecar application on [http://localhost:5678](http://localhost:5678)

![Sidecar](https://github.com/jmnarloch/generator-express-sidecar/raw/master/sidecar.png "Siedcar")

The application itself runs on [http://localhost:3000](http://localhost:3000) and this is the address that will be 
registered within Eureka.

## Configuration


The `application.yml` sets the home address to be accessed by other applications and the health url:

```yaml
server:
  port: ${PORT:5678}

spring:
  application:
      name: express-sidecar

sidecar:
  port: 3000
  home-page-uri: http://localhost:${sidecar.port}/
  health-uri: http://localhost:${sidecar.port}/health

```


## License

MIT
