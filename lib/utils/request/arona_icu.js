import { logger } from "node-karin"
import { config } from "../config.js"

const BASE_URL = 'https://api.arona.icu/api'
const APIS = {
    user_info: `${BASE_URL}/friends/refresh`
}

const SERVERS = {
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

const request = async (api, method, data) => {
    const token = config().token
    const url = APIS[api]
    const headers = {
        'Content-Type': 'application/json',
        'key': token
    }
    let res
    try{
        res = await ( await fetch(url, {
            method: method,
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

export { request, SERVERS }