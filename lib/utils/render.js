import { render, getPkgVersion } from 'node-karin'
import { fileURLToPath } from 'url'
import { pkg, dirPath } from './index.js'
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES = {
    'help': '../../resources/template/help/index.html',
}

async function Render(template, data) {
    return await render.render({
        file: path.resolve(__dirname, TEMPLATES[template]),
        quality: 100,
        data: {
            ...data,
            currentPath: dirPath + '/resources/template/',
            karin_version: await getPkgVersion('node-karin'),
            plugin_version: pkg().version,
        },
        pageGotoParams: {
            waitUntil: 'networkidle2'
        }
    })
}

export { Render, TEMPLATES }