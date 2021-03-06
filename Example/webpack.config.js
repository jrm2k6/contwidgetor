'use strict';

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var config = {

  debug: true,

  devtool: 'source-map',

  entry: {
    'bundle': ['./app.js']
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.json$/,
      exclude: /(node_modules)/,
      loader: 'json-loader'
    }]
  },

  plugins: [],

};

module.exports = config;
