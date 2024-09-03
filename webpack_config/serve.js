'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isWebGLEnabled = process.argv.some(
    (arg) => arg.startsWith('--webgl') && arg.split('=')[1] === 'true'
);
const templateName = (() => {
    if (process.env.NODE_ENV === 'serve') {
        return isWebGLEnabled ? 'example_webgl.ejs' : 'example.ejs';
    } else {
        return 'example_mini.ejs';
    }
})();
const template = path.resolve('example', templateName);
const devServerPort = 8080;

module.exports = {
    mode: 'development',
    module: {
        rules: [],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template,
            title: 'Entry Example',
            filename: path.resolve('dist', 'index.html'),
            inject: false,
            hash: true,
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, '../'),
        },
        port: devServerPort,
        historyApiFallback: true,
        devMiddleware: {
            publicPath: '/',
        },
        proxy: {
            '/lib/entry-js': {
                target: `http://127.0.0.1:${devServerPort}`,
                pathRewrite: { '^/lib/entry-js': '' },
            },
            '/dist': {
                target: `http://127.0.0.1:${devServerPort}`,
                pathRewrite: { '^/dist': '' },
            },
            '/lib/@entrylabs': {
                target: `http://127.0.0.1:${devServerPort}`,
                pathRewrite: { '^/lib/@entrylabs': '/node_modules/@entrylabs' },
            },
        },
    },
    devtool: 'source-map',
};
