import { karin, segment } from 'node-karin'
import { request, SERVER_LIST } from '../utils/request/arona_icu.js'
import { baUser } from '../utils/user.js'

const regs = {
    bind: /^(?:~|～)(?:b|bind)( [a-zA-Z0-9_]{7})?( [0-9])?$/i,
    servers: /^(?:~|～)(?:s|servers)$/i,
    accounts: /^(?:~|～)(?:a|accounts)$/i,
    delete: /^(?:~|～)(?:del|delete)( [0-9])?$/i,
}

export const userBind = karin.command(regs.bind, async (e) => {

    const match = e.rawMessage.match(regs.bind)
    if(!match[1] || !match[2])
        return e.reply(`使用方式:\n~bind 好友码(七位) 服务器\n1代表国服,其余请使用 ~servers 查看\n示例: ~b pllm4ug 1`, { recallMsg: 10 })
    
    let res = await request('user_info', 'POST', {
        "server": match[2].trim(),
        "friend": match[1].trim()
    })
    if(res.code != 200) return e.reply(`出现错误:\n${res.message}`, { recallMsg: 10 })
    
    const { data } = res
    e.reply(`你即将绑定 [${SERVER_LIST[data.server]}]${data.nickname} , 回复 OK 以确认.`, { recallMsg: 30 })
    e = await karin.ctx(e,{
        reply: true,
        replyMsg: `超时未回复, 绑定已取消.`,
        recallMsg: 30
    })
    if(e.msg.trim() !== 'OK') return e.reply(`绑定已取消.`, { recallMsg: 30 })
    
    const user = new baUser(e.userId)
    user.addAccount(data.fid, data.server)
    return e.reply(`绑定成功, 使用 ~help 查看可用指令.`, { recallMsg: 30 })
})

export const userAccountList = karin.command(regs.accounts, async (e) => {
    const user = new baUser(e.userId)
    const accounts = user.data.accounts.map((item, index) => `${index+1}. [${SERVER_LIST[item.server]}]${item.fid}`)
    return e.reply(`可用的账号列表:\n${accounts.join('\n')}, 默认账号: ${user.data.default_account+1}`, { recallMsg: 30 })
})

export const delAccount = karin.command(regs.delete, async (e) => {
    const match = e.rawMessage.match(regs.delete)[1]
    if(!match) return e.reply(`使用方式:\n~del 账号序号`, { recallMsg: 30 })
})

export const server_list = karin.command(regs.servers, segment.text(`可用服务器列表:\n${(() => {
    let msg = []
    for (let index in SERVER_LIST) msg.push(`${index}: ${SERVER_LIST[index]}\n`)
    return msg.join('')
})()}`))
