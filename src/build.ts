import webpack from 'webpack'
import { getWebpackConf } from './webpack'

export const build = () => {
    const cc = webpack(getWebpackConf())
    cc.run((err, stats) => {
        if (err) {
            console.error(err)
            return
        }
        if (stats?.hasErrors()) {
            stats.compilation.errors.forEach((e) => {
                console.error(e)
            })
            return
        }
    })
}
