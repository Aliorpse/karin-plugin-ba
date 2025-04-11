import { logger } from "node-karin"
import { config } from "../config.js"

const BASE_URL = 'https://api.arona.icu/api'
const APIS = {
    user_info: ['POST', `${BASE_URL}/friends/refresh`]
}

const SERVER_LIST = {
    1: '国服',
    2: 'B服',
    3: '日服',
    4: '综合',
    5: '全球',
    6: '港澳台',
    7: '韩服',
    8: '亚服',
    9: '北美服'
}

const get_arona_icu = async (api, data) => {
    const token = config().tokens.arona_icu
    if(token == 'your_token_here') return { code: 10001, message: '您还未配置token!' }
    
    const url = APIS[api][1]
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `ba-token ${token}`
    }
    let res
    try{
        res = await ( await fetch(url, {
            method: APIS[api][0],
            headers: headers,
            body: JSON.stringify(data)
        })).json()
    }catch(e){
        res = {
            code: 10000,
            message: e.message
        }
        logger.error(e)
    }
    return res
}

export { get_arona_icu, SERVER_LIST }