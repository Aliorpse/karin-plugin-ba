import { karin, segment } from 'node-karin'
import {
    get_arona_icu,
    SERVER_LIST,
    newUser,
    createCommandRegex as createRegex,
} from '../utils/index.js'

const regs = {
    bind: createRegex('b/bind', ['[a-zA-Z0-9_]{7}', '[0-9]']),
    servers: createRegex('servers'),
    accounts: createRegex('acc/accounts'),
    delete: createRegex('del/delete', ['[0-9]']),
    set_default: createRegex('sd/setdefault', ['[0-9]']),
}

export const userBind = karin.command(regs.bind, async (e) => {
    const match = e.rawMessage.match(regs.bind)

    if(!match[1] || !match[2])
        return e.reply(`使用方式:\n~bind 好友码(七位) 服务器\n1代表国服,其余请使用 ~servers 查看\n示例: ~b pllm4ug 1`)

    const server = match[1].trim()
    const fid = match[2].trim()

    const user = await newUser(e.userId)
    
    if (user.data.accounts.some(item => item.fid === fid && item.server === server)) 
        return replyMessage(e, `你已经绑定了这个账号.`, { recallMsg: 30 })

    let res = await get_arona_icu('user_info', {
        "server": server,
        "friend": fid
    })
    if(res.code != 200) return e.reply(`出现错误:\n${res.message}`, { recallMsg: 120 })
    
    const { data } = res
    e.reply(`你即将绑定 [${SERVER_LIST[data.server]}]${data.nickname} , 回复 OK 以确认.`, { recallMsg: 30 })
    e = await karin.ctx(e,{
        reply: true,
        replyMsg: `超时未回复, 绑定已取消.`,
        recallMsg: 30
    })
    if(e.msg !== 'OK') return e.reply(`绑定已取消.`, { recallMsg: 30 })
        
    user.data.accounts.push({
        fid: fid,
        server: server,
        authenticated: false,
    })
    await user.save()
    console.log(user.data.accounts[0])

    return e.reply(`绑定成功, 使用 ~help 查看可用指令.`)
})

export const userAccountList = karin.command(regs.accounts, async (e) => {
    const user = await newUser(e.userId)
    if(user.data.accounts.length === 0) return e.reply(`你还没有绑定账号, 使用 ~bind 绑定账号.`, { recallMsg: 60 })
    const accounts = user.data.accounts.map((item, index) => `${index + 1}. [${SERVER_LIST[item.server]}]${item.fid}`)
    return e.reply(`可用的账号列表:\n${accounts.join('\n')}\n默认账号: ${user.data.default_account+1}`)
})

export const delAccount = karin.command(regs.delete, async (e) => {
    const match = e.rawMessage.match(regs.delete)[1]
    if(!match) return e.reply(`使用方式:\n~del 账号序号`)
    const user = await newUser(e.userId)
    user.data.accounts.splice(match.trim() - 1, 1)
    await user.save()
    return e.reply(`账号删除成功.`)
})

export const setDefaultAccount = karin.command(regs.set_default, async (e) => {
    const match = e.rawMessage.match(regs.set_default)[1]
    if(!match) return e.reply(`使用方式:\n~sd 账号序号`)
    const user = await newUser(e.userId)
    user.data.default_account = match.trim() - 1
    await user.save()
    return e.reply(`默认账号设置成功. 你现在的默认账号是:\n [${SERVER_LIST[user.data.default_account + 1]}]${user.data.accounts[user.data.default_account].fid}`)
})

export const server_list = karin.command(regs.servers, segment.text(
    `可用服务器列表:\n${Object.keys(SERVER_LIST).map(key => `${key}. ${SERVER_LIST[key]}`).join('\n')}`
))
