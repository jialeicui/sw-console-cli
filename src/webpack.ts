import { Configuration } from 'webpack'
import { join } from 'path'
import { readdirSync } from 'fs'

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

export const getWebpackConf = (): Configuration => {
    const dir = join(process.cwd(), 'src')
    return {
        mode: 'development',
        context: dir,
        target: 'web',
        entry: getEntry(dir),
        output: {
            path: join(process.cwd(), 'dist'),
            filename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            modules: [dir, 'node_modules'],
        },
        externals: [
            'lodash',
            'moment',
            'react',
            'react-dom',
            'react-redux',
            'redux',
            'rxjs',
            'react-router',
            'react-router-dom',
            'd3',
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
