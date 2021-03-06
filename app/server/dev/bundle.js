import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './../../../webpack.config.js';

// Modified from code outlined in:
// http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup

module.exports = function (host, port) {

  // First we fire up Webpack an pass in the configuration we
  // created
  let bundleStart = null;
  const compiler = Webpack(webpackConfig);

  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', function() {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  // We also give notice when it is done compiling, including the
  // time it took. Nice to have
  compiler.plugin('done', function() {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
  });

  const bundler = new WebpackDevServer(compiler, {

    // We need to tell Webpack to serve our bundled application
    // from the build path. When proxying:
    // http://localhost:3000/build -> http://localhost:8080/build
    publicPath: '/build/',

    // Configure hot replacement
    hot: true,

    // The rest is terminal configurations
    quiet: false,
    noInfo: true,
    stats: {
      colors: true
    }
  });

  // We fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  bundler.listen(port, host, function () {
    console.log('Bundling project, please wait...');
  });

};
