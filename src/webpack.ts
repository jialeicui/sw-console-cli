import { Configuration } from 'webpack'
import { join } from 'path'
import { readdirSync } from 'fs'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const getEntry = (dir: string) => {
    const files = readdirSync(dir).filter((file) => {
        return /^entry.([tj])sx?$/.exec(file)
    })
    if (files.length == 0) {
        console.error('get files', files)
        throw `can not find entry point`
    }
    return {
        entry: join(dir, files[0]),
    }
}

// TODO read from manifest.json
const pluginName = () => {
    return 'foo'
}

export const getWebpackConf = (): Configuration => {
    const dir = join(process.cwd(), 'src')
    return {
        mode: 'development',
        context: dir,
        target: 'web',
        entry: getEntry(dir),
        output: {
            path: join(process.cwd(), 'dist'),
            library: {
                type: 'module',
            },
            filename: '[name].js',
        },
        experiments: {
            outputModule: true,
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'img/**/*',
                        to: '.',
                        noErrorOnMissing: true,
                    },
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.[tj]sx?$/,
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            presets: [
                                [require.resolve('@babel/preset-env'), { modules: false }],
                                [
                                    require.resolve('@babel/preset-typescript'),
                                    {
                                        allowNamespaces: true,
                                        allowDeclareFields: true,
                                    },
                                ],
                                [require.resolve('@babel/preset-react')],
                            ],
                            plugins: [
                                [
                                    require.resolve('@babel/plugin-transform-typescript'),
                                    {
                                        allowNamespaces: true,
                                        allowDeclareFields: true,
                                    },
                                ],
                            ],
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    type: 'asset/resource',
                    generator: {
                        publicPath: `public/plugins/${pluginName()}/img/`,
                        outputPath: 'img/',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
                    type: 'asset/resource',
                    generator: {
                        publicPath: `public/plugins/${pluginName()}/fonts/`,
                        outputPath: 'fonts/',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            modules: [dir, 'node_modules'],
        },
        externals: [
            ({ request }, callback) => {
                const prefix = 'starwhale/'
                if (request?.indexOf(prefix) === 0) {
                    return callback(undefined, request.slice(prefix.length))
                }

                callback()
            },
        ],
    }
}
