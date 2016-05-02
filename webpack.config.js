const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const common = {
  //Entry accepts a path or an object of entries. We'll be using the
  //later form given it's convient with more complex configurations
  entry: {
    app: PATHS.app,
  },
  // Add resolve.extenstions
  // '' is needed to resolve imports without an extention
  // note the .'s before the extenstions as it will fail without
  resolve: {
    extenstion: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      //test expects regexp
      test: /\.css$/,
      loaders: ['style', 'css'],
      //include either accepts a path or an array of paths
      include: PATHS.app
    }, {
      test: /\.jsx$/,
      //enable caching for improved performance during development
      // It uses the default OS directory by default. If you need something
      // more custom, pass a path to it. ie babel?cacheDirectory=<path>
      loaders: ['babel?cacheDirectory'],
      // Parse only app files, without this it will likely go through the entire project
      // in addition to being slow it will mostly likely result in an Error
      include PATHS.app
    }]
  }
};
//Default configuration. We will return this if
//Webpack is called outside of npm.

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      //Enable history API fallback so HTML5 History API based
      //routing works. This is a good default that will come in
      //handy in more complicated setups
      historyAPIFallback: true,
      hot: true,
      inline: true,
      progress: true,

      //Display only errors to reduce the ammount of output
      stats: 'errors-only',

      //Parse host and port from env so this is easy to customize.
      //
      //If you use Vagrant or Cloud9, set
      // host: process.env.HOST || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices unlike Default
      //localhost
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true //save
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
