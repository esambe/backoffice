const webpack = require('webpack');
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');

const path = require("path");
const APP_DIR = path.resolve(__dirname, '../src');

module.exports = env => {
  const { PLATFORM, VERSION } = env;
  return merge([
      {
        devtool: PLATFORM!=="production"?'source-map':false,
        entry: ['@babel/polyfill', APP_DIR],
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader'
              }
            },
            {
              test: /\.(scss|css)$/,
              use: [
                PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader',
                'sass-loader'
              ]
            },
            {
              test: /\.(png|jpe?g|gif)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    outputPath: 'images',
                  },
                },
              ],
            },
            {
                test: /fonts\/.*\.(woff|woff2|eot|ttf|svg)$/,
                use: [
                  {
                    loader: 'file-loader?name="[name]-[hash].[ext]"',
                    options: {
                      outputPath: 'fonts',
                    },
                  },
                ]
            }
          ]
        },
        plugins: [
          new HtmlWebpackPlugin({
            template: './html_template/index.html',
            filename: './index.html'
          }),
          new webpack.DefinePlugin({ 
            'process.env.VERSION': JSON.stringify(env.VERSION),
            'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
          }),
          new CopyPlugin([
            { from: './favicon.png' },
          ]),
        ],
    }
  ])
};