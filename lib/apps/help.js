import karin, { segment } from 'node-karin'
import { Render } from '../utils/index.js'

const regs = {
    help: /^(?:~|～)(?:h|help)$/i,
}
export const help = karin.command(regs.help, async (e) => {
    const data = {
        custom_title: '什亭之匣',
    }
    const img = await Render('help', data)
    return e.reply(segment.image(img))
})