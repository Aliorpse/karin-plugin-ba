import { dirPath } from './dir.js'
import {
  watch,
  karinPathBase,
  filesByExt,
  copyConfigSync,
  requireFileSync,
  logger,
} from 'node-karin'

let cache

/**
 * @description package.json
 */
export const pkg = () => requireFileSync(`${dirPath}/package.json`)

/** 用户配置的插件名称 */
const pluginName = pkg().name.replace(/\//g, '-')
/** 用户配置 */
const dirConfig = `${karinPathBase}/${pluginName}/config`
/** 默认配置 */
const defConfig = `${dirPath}/config/config`

/**
 * @description 初始化配置文件
 */
copyConfigSync(defConfig, dirConfig, ['.yaml'])

/**
 * @description 配置文件
 */
export const config = () => {
  if (cache) return cache
  const user = requireFileSync(`${dirConfig}/config.yaml`)
  const def = requireFileSync(`${defConfig}/config.yaml`)
  const result = { ...def, ...user }

  cache = result
  return result
}

/**
 * @description 监听配置文件
 */
setTimeout(() => {
  const list = filesByExt(dirConfig, '.yaml', 'abs')
  list.forEach(file => watch(file, (old, now) => {
    cache = undefined
  }))
}, 2000)

/**
 * @description 检查配置文件是否过时
 */
function isConfigEqual(obj1, obj2) {
  // 基本类型
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null)
    return true

  // 类型一致?
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false
  }

  // 数组直接返回 true
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    return true
  }

  // 对象
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!isConfigEqual(obj1[key], obj2[key])) return false
  }

  return true
}

if(!isConfigEqual(requireFileSync(`${dirConfig}/config.yaml`), requireFileSync(`${defConfig}/config.yaml`))) {
  logger.warn(`${logger.green('[karin-plugin-ba]')} 配置文件过时, 请手动删除 config/config.yaml 文件, 重启 Karin 来获取新的配置文件结构.`)
  logger.warn(`${logger.green('[karin-plugin-ba]')} 你需要重新填写配置文件, 所以在删除原配置文件前务必记住你的原配置.`)
}