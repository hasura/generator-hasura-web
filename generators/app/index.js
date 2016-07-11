'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

const tplCopy = function (name, to, props) {
  this.fs.copy(
    this.templatePath(name),
    this.destinationPath(to || name),
    (props || this.props)
  );
};

const fileListCopy = function (files, dest) {
  const cpy = tplCopy.bind(this);
  files.forEach(filename => {
    cpy(filename, dest, this.props);
  });
};

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-hasura') + ' generator!'
    ));
  },

  writing: function () {
    // root files
    var copyFiles = fileListCopy.bind(this);
    var baseFiles = [
      'package.json',
      'hasuraconfig.js',
      'README.md',
      'runserver.sh',
      'reducerTest.js',
      'tests.webpack.js',
      'karma.conf.js',
      '.babelrc',
      '.editorconfig',
      '.eslintrc',
      '.eslintignore',
      '.travis.yml',
      'server.babel.js',
      'api/',
      'bin/',
      'src/',
      'static/',
      'webpack/'
    ];
    copyFiles(baseFiles); 
  },

  install: function () {
    this.installDependencies();
  }
});
