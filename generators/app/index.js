'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the world-class ' + chalk.red('Spring Cloud Sidecar') + ' generator!'
    ));

    this.copy = function (dir, src, dest) {
      this.fs.copy(
        this.templatePath(dir + src),
        this.destinationPath(dir + dest)
      );
    }.bind(this);

    this.copySync = function (dir, src, dest) {
      this.fs.copySync(
        this.templatePath(dir + src),
        this.destinationPath(dir + dest)
      );
    }.bind(this);

    this.template = function (dir, src, dest) {
      this.fs.copyTpl(
        this.templatePath(dir + src),
        this.destinationPath(dir + dest),
        this.props
      );
    }.bind(this);
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'applicationName',
      message: 'Your application name (to be registered within discovery service)',
      default: 'express-sidecar'
    }, {
      type: 'list',
      name: 'discoveryService',
      message: 'Choice your discovery service',
      choices: [
        {
          name: 'Eureka',
          value: 'eureka'
        },
        {
          name: 'Consul (Experimental)',
          value: 'consul'
        }
      ],
      default: 0
    }, {
      when: function (response) {
        return response.discoveryService == 'eureka';
      },
      type: 'input',
      name: 'eurekaServiceUrl',
      message: 'The Eureka url',
      default: 'http://localhost:8761/eureka/'
    }, {
      when: function (response) {
        return response.discoveryService == 'consul';
      },
      type: 'input',
      name: 'consulHost',
      message: 'The Consul host',
      default: 'localhost'
    }, {
      when: function (response) {
        return response.discoveryService == 'consul';
      },
      type: 'input',
      name: 'consulPort',
      message: 'The Consul port',
      default: 8500
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      done();
    }.bind(this));
  },

  writing: {

    appDirs: function () {
      mkdirp('app/public/images/');
      mkdirp('app/public/javascripts/');
      mkdirp('app/public/stylesheets/');
    },

    app: function () {
      this.copy('app/bin/', '_www', 'www');
      this.copy('app/public/stylesheets/', '_style.css', 'style.css');
      this.copy('app/routes/', '_health.js', 'health.js');
      this.copy('app/routes/', '_index.js', 'index.js');
      this.copy('app/routes/', '_users.js', 'users.js');
      this.copy('app/views/', '_error.jade', 'error.jade');
      this.copy('app/views/', '_index.jade', 'index.jade');
      this.copy('app/views/', '_layout.jade', 'layout.jade');
      this.copy('app/', '_package.json', 'package.json');
      this.copy('app/', '_app.js', 'app.js');
    },

    sidecar: function () {
      this.copy('sidecar/gradle/wrapper/', '_gradle-wrapper.jar', 'gradle-wrapper.jar');
      this.copy('sidecar/gradle/wrapper/', '_gradle-wrapper.properties', 'gradle-wrapper.properties');
      this.copy('sidecar/src/main/java/org/springcloud/sidecar/', '_SidecarApplication.java', 'SidecarApplication.java');
      this.template('sidecar/src/main/resources/', '_application.yml', 'application.yml');
      this.template('sidecar/src/main/resources/', '_bootstrap.yml', 'bootstrap.yml');
      this.template('sidecar/', '_build.gradle', 'build.gradle');
      this.copy('sidecar/', '_gradlew', 'gradlew');
      this.copy('sidecar/', '_gradlew.bat', 'gradlew.bat');
    },

    projectfiles: function () {
      this.copy('', 'gitignore', '.gitignore');
      this.copy('', 'npm_install', '.npm_install');
    }
  },

  install: function () {
    if (this.options.skipInstall) {
      return this;
    }

    this.log('Running npm install');
    fs.chmodSync(this.destinationPath('.npm_install'), '0744');
    this.spawnCommandSync('./.npm_install', []);

    this.log('Running gradle build');

    var command = './sidecar/gradlew';
    if (/^win/.test(process.platform)) {
      command = './sidecar/gradlew.bat';
    }
    this.spawnCommandSync(command, ['-p', 'sidecar', 'build']);
  }
});
