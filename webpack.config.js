const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: {
    'worker': './src/worker/index.js',
    'page': './src/page/index.js',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        plugins: ['transform-decorators-legacy'],
        presets: ['es2015', 'react', 'stage-0']
      }
    }]
  },
  output: {
    filename: '[name].js',
    path: __dirname,
    publicPath: '/static/',
    library: 'react-worker-dom',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
    })
  ],
  resolve: {
    modules: [
      resolve(__dirname, './src'),
      resolve(__dirname, './node_modules')
    ]
  },
};
