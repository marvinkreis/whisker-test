const path = require('path');

module.exports = [

    /* Web */
    {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        target: 'web',
        entry: {
            whisker: path.resolve('src', 'index.js')
        },

        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },

        output: {
            library: 'Whisker',
            filename: '[name].js',
            libraryTarget: 'umd',
            path: path.resolve('dist', 'web')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: path.resolve(__dirname, 'src')
                },
                {
                    test: path.resolve('dist/src', 'index.js'),
                    loader: 'expose-loader?Whisker'
                },
                {
                    test: /\.ts|\.tsx$/,
                    use: 'ts-loader',
                    exclude: path.resolve(__dirname, '/node_modules/'),
                    include: path.resolve(__dirname, 'src')
                }
            ]
        },
        devtool: 'source-map'
    },

    /* Node */
    {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        target: 'node',
        entry: {
            whisker: path.resolve('src', 'index.js')
        },
        output: {
            library: 'Whisker',
            filename: '[name].js',
            libraryTarget: 'commonjs2',
            path: path.resolve('dist', 'node')
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: path.resolve(__dirname, 'src')
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        devtool: 'source-map'
    }

];
