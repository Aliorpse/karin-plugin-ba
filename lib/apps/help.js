import karin, { segment } from 'node-karin'
import { Render, config } from '../utils/index.js'
import { createCommandRegex as createRegex } from '../utils/index.js'

const regs = {
    help: createRegex('h/help'),
}
export const help = karin.command(regs.help, async (e) => {
    const data = {
        custom_title: config().help_custom.title || '什亭之匣',
    }
    const img = await Render('help', data)
    return e.reply(segment.image(img))
})