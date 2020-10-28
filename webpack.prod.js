const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const loader = require('sass-loader');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const workbox = require('workbox-webpack-plugin');

module.exports = {
    mode: 'development', // set to production to minify everything
    entry: './app/client/assets/scripts/App.js',
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },

    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },

    plugins:[
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),

        new HtmlWebpackPlugin({
            template: './app/client/index.html',
            filename: 'index.html',
            inject: true,
            minify: {
                collapseWhitespace: false, //set true to minify and save space
                removeComments: true //set true to remove comments and save space           
            }
        }),

        new HtmlWebpackInlineSVGPlugin({
            img: path.resolve(__dirname, 'app/client/assets/images'),
            inlineAll: true,
            svgoConfig: [
                {
                    removeXMLNS: true
                },
                {
                    cleanupIDs: true,
                }    
            ]
        }),

        new CleanWebpackPlugin(),

        new workbox.GenerateSW({
            swDest: 'sw.js',
        })
    ],

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'group-css-media-queries-loader',
                    'sass-loader'
                ]    
            },
            {
                test: /\.html$/i,
                use: ['html-loader']
            },
            {
                test: /\.svg$/i,
                use: ['file-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: "images_loaded"
                    }
                }
            }
        ]
    },
}
            