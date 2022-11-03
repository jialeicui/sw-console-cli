import simpleGit from 'simple-git'
import { prompt } from 'inquirer'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { getVersion } from './utils'

interface createProps {
    name: string
    template?: string
}

interface pluginInfo {
    name: string
    version: string
}

const defaultTemplate = 'https://github.com/star-whale/starwhale-panel-plugin-template.git'

const updateJson = (path: string, overwrite: any) => {
    const content = existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : {}
    for (const k in overwrite) {
        content[k] = overwrite[k]
    }
    writeFileSync(path, JSON.stringify(content, null, 2))
}

const updatePackageJson = (path: string, info: pluginInfo) => {
    const file = resolve(path, 'package.json')
    updateJson(file, info)
}

const generateManifestJson = (path: string, info: pluginInfo) => {
    const file = resolve(path, 'manifest.json')
    updateJson(file, { ...info, frameWorkVersion: getVersion(), controller: '^0.3.0' })
}

export const create = async ({ template }: createProps) => {
    const info = await prompt<pluginInfo>([
        {
            type: 'input',
            name: 'name',
            message: "Your plugin's name",
        },
        {
            type: 'input',
            name: 'version',
            message: "Your plugin's version",
            default: 'v0.1',
        },
    ])
    const path = resolve(process.cwd(), info.name)
    if (existsSync(path)) {
        throw `path ${path} exists`
    }
    await simpleGit().clone(template ?? defaultTemplate, info.name)
    updatePackageJson(path, info)
    generateManifestJson(path, info)
}
