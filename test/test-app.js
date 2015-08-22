'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('express-sidecar:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'app/bin/www',
      'app/public/stylesheets/style.css',
      'app/routes/health.js',
      'app/routes/index.js',
      'app/routes/users.js',
      'app/views/error.jade',
      'app/views/index.jade',
      'app/views/layout.jade',
      'app/app.js',
      'app/package.json',
      'sidecar/gradle/wrapper/gradle-wrapper.jar',
      'sidecar/gradle/wrapper/gradle-wrapper.properties',
      'sidecar/src/main/java/org/springcloud/sidecar/SidecarApplication.java',
      'sidecar/src/main/resources/application.yml',
      'sidecar/src/main/resources/bootstrap.yml',
      'sidecar/build.gradle',
      'sidecar/gradlew',
      'sidecar/gradlew.bat',
      '.gitignore',
      '.npm_install'
    ]);
  });
});
