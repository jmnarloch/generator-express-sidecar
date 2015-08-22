'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
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
      message: 'Your application name (to be registered within Eureka)',
      default: 'express-sidecar'
    }, {
      type: 'input',
      name: 'eurekaServiceUrl',
      message: 'The Eureka url',
      default: 'http://localhost:8761/eureka/'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      done();
    }.bind(this));
  },

  writing: {

    appDirs: function() {
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
      this.copy('app/', '_app.js', 'app.js');
      this.copy('app/', '_package.json', 'package.json');
    },

    sidecar: function () {
      this.copy('sidecar/gradle/wrapper/', '_gradle-wrapper.jar', 'gradle-wrapper.jar');
      this.copy('sidecar/gradle/wrapper/', '_gradle-wrapper.properties', 'gradle-wrapper.properties');
      this.copy('sidecar/src/main/java/org/springcloud/sidecar/', '_SidecarApplication.java', 'SidecarApplication.java');
      this.template('sidecar/src/main/resources/', '_application.yml', 'application.yml');
      this.template('sidecar/src/main/resources/', '_bootstrap.yml', 'bootstrap.yml');
      this.copy('sidecar/', '_build.gradle', 'build.gradle');
      this.copy('sidecar/', '_gradlew', 'gradlew');
      this.copy('sidecar/', '_gradlew.bat', 'gradlew.bat');
    },

    projectfiles: function () {
      this.copy('', 'gitignore', '.gitignore');
    }
  },

  install: function () {
    // this.installDependencies();
  }
});
