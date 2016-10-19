let webpack = require('webpack');

module.exports = {
    entry: {
        app: './main.js'
    },
    output: {
        path: `${__dirname}/../www`,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/, 
                loader: 'file?name=[path][name].[ext]'
            },
            { 
                test: /\.(woff2?|eot|ttf|otf)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '/img/[name].[hash:7].[ext]'
                }
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.html$/,
                loader: 'file?name=[path][name].[ext]'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file',
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
