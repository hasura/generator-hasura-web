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
      'Welcome to the ' + chalk.red('generator-hasura-web') + ' generator!'
    ));
    this.log('Creating Example app on the current directory.');
  },

  writing: function () {
    // root files
    var copyFiles = fileListCopy.bind(this);
    var baseFiles = [
      'app.json',
      'package.json',
      'hasuraconfig.js',
      'README.md',
      'runserver.sh',
      '.babelrc',
      '.bootstraprc',
      '.editorconfig',
      '.eslintrc',
      '.eslintignore',
      'server.babel.js',
      'bin/',
      'src/',
      'static/',
      'webpack/'
    ];
    copyFiles(baseFiles); 
  },

  install: function () {
    this.installDependencies({ bower: false });
  }
});
