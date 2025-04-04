import karin, { segment, getPkgVersion } from 'node-karin'
import { pkg, Render, dirPath } from '../utils/index.js'

const regs = {
    help: /^(?:~|～)(?:h|help)$/i,
}
export const help = karin.command(regs.help, async (e) => {
    const data = {
        custom_title: '什亭之匣',
        karin_version: await getPkgVersion('node-karin'),
        plugin_version: pkg().version,
        currentPath: dirPath + '/resources/template/help',
    }
    const img = await Render('help', data)
    return e.reply(segment.image(img))
})