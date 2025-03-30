import { logger } from 'node-karin'
import { basename, pkg } from './utils/index.js'

logger.info(`${logger.violet(`[插件:${pkg().version}]`)} ${logger.green(basename)} 初始化完成~`)
