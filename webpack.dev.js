const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const loader = require('sass-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool: 'source-map',

    entry: './app/client/assets/scripts/App.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'app/client')
    },

    devServer: {
        contentBase: path.join(__dirname, 'app/client'),
        port: 8000,
        host: '0.0.0.0'

        // For using webpack sync on smartphone:
        // 1. run "npm run dev"
        // 2. localhost:3000 on laptop
        // 3. Find your ip adress in system Preferences > network (192.168.x.x)
        // 4. add url "ip adresss:3000" on smartphone browser
    },

    plugins:[
        new HtmlWebpackPlugin({
            template: './app/client/index.html'
        }),

        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),

        new WorkboxPlugin.GenerateSW()
    ],

    module: {
        rules: [
            {
                test: /\.scss$/i,
                exclude: /node_modules/,
                use: [ 
                    'style-loader',
                    'css-loader',   
                    {
                        loader: 'group-css-media-queries-loader'
                    },
                    'sass-loader'
                ],
            },{
                test: /\.(png|jpg|gif)$/i,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
}