
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, { mode }) => {
    console.log({ mode })
    const isProduction = mode === 'production'
    return {
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-react',
                                {
                                    runtime: 'automatic'
                                }
                            ]
                        ]
                    }
                },
                {
                    test: /\.ts?$/,
                    loader: 'ts-loader'
                },
                {

                    test: /.(css|sass|scss)$/,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],

                },
                {
                    type: "asset",
                    test: /\.(png|svg|jpg|jpeg|gif)$/i
                }

            ]
        },
        plugins: [
            new HtmlWebpackPlugin(
                {
                    title: 'Development',
                    template: './public/index.html',
                    inject: true
                }
            ),
            new Dotenv(),
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: "bundle", to: "bundle" },
                ],
            }),
        ],

        output: {
            filename: isProduction ? '[name].[contenthash].js' : 'main.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        devServer: {
            historyApiFallback: true,

            // contentBase: path.resolve(__dirname, 'build'), default,
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                }
            },
            open: true, // para abrir el navegador
            compress: true,
            port: 8000,
            hot: false,
            liveReload: true,
            headers: { "Access-Control-Allow-Origin": 'http://localhost' },
        },
        devtool: 'source-map',

    }


}