var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8009',
    path.resolve(__dirname, 'app/client/app.jsx')
  ],
  output: {
    path: __dirname + '/app/assets',
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  devtool: '#source-map',
  module: {
    loaders: [
  		{
        test: /\.jsx$/,
        loaders: ["react-hot-loader", "babel-loader?stage=0"],
  			include: path.join(__dirname, "app/client")
      },
  		{
        test: /\.js$/,
  			loader: "babel-loader?stage=0",
  			include: [path.join(__dirname, "app/server"), path.join(__dirname, "app/client")]
  		}
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
