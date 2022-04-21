const path = require('path'); // Para trabajar con archivos y rutas de directorios
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production', // le pasamos explicitamente el modo desde el archivo
    entry: './src/index.js', // el punto de entrada de mi aplicación
    output: { // Esta es la salida de mi bundle
        path: path.resolve(__dirname, 'public_html/js'),
        // resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
        // para no tener conflictos entre Linux, Windows, etc
        filename: '[name].[contenthash].js', 
        assetModuleFilename: 'assets/images/[hash][ext][query]'
        // EL NOMBRE DEL ARCHIVO FINAL,
    },
    resolve: {
        extensions: ['.js'], // LOS ARCHIVOS QUE WEBPACK VA A LEER
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/')
        }
    },
    module : {
        rules: [
            {
        // Test declara que extensión de archivos aplicara el loader
                test: /\.m?js$/,
        // Use es un arreglo u objeto donde dices que loader aplicaras
                use: {
                    loader: "babel-loader"
                },
        // Exclude permite omitir archivos o carpetas especificas
                exclude: /node_modules/
            },
            {
                test: /\.css|\.styl$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader',
                'stylus-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // {
            //     test: /\.(woff|woff2)$/,
            //     use: {
            //         loader: 'url-loader',
            //         options: {
            //             limit: 10000,
            //             mimetype: 'application/font-woff',
            //             name: '[name].[ext]',
            //             outputPath: './assets/fonts/',
            //             publicPath: './assets/fonts/',
            //             esModule: false
            //         }
            //     }
            // }
            {
                test: /\.(woff|woff2)$/i,  // Tipos de fuentes a incluir
                type: 'asset/resource',  // Tipo de módulo a usar (este mismo puede ser usado para archivos de imágenes)
                generator: {
                filename: 'static/fonts/[hash][ext][query]',  // Directorio de salida
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './public/index.html',
            filename: './index.html',
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,'src','assets/images'),
                    to: 'assets/images'
                }
            ]
        }),
        new Dotenv(),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ],
    }
}