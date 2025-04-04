import { render, karinPathBase } from 'node-karin'
import { fileURLToPath } from 'url'
import path from "path"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES = {
    'help': '../../resources/template/help/index.html',
}

async function Render(template, data) {

    let html = fs.readFileSync(path.resolve(__dirname, TEMPLATES[template]), 'utf8')

    const filename = `plugin-ba.html`
    const tempDir = path.join(karinPathBase, 'temp/html/render')

    const tempPath = path.join(tempDir, filename)
    fs.writeFileSync(tempPath, html, 'utf8')

    return await render.render({
        file: tempPath,
        quality: 100,
        data: data,
        pageGotoParams: {
            waitUntil: 'networkidle2'
        }
    })
}

export { Render, TEMPLATES }