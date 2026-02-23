/**
 * 统一日志框架
 *
 * 提供多级别日志输出，支持开发/生产环境差异化配置。
 * 生产环境默认仅输出 warn 及以上级别，减少控制台噪音。
 *
 * @example
 *   logger.debug('调试信息')
 *   logger.info('普通信息')
 *   logger.warn('警告信息')
 *   logger.error('错误信息', error)
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4
}

/** 当前环境是否为开发模式 */
const isDev = import.meta.env.DEV

/** 生产环境默认最小输出级别 */
const DEFAULT_LEVEL = isDev ? 'debug' : 'warn'

/** 全局日志级别 */
let currentLevel = LOG_LEVELS[DEFAULT_LEVEL]

const PREFIX = '[CampusLife]'

/**
 * 设置全局日志级别
 * @param {keyof LOG_LEVELS} level - 'debug' | 'info' | 'warn' | 'error' | 'none'
 */
export function setLogLevel(level) {
  currentLevel = LOG_LEVELS[level] ?? LOG_LEVELS.warn
}

/**
 * 格式化日志参数，统一时间戳与标签
 * @param {string} level
 * @param {any[]} args
 */
function formatArgs(level, args) {
  const time = new Date().toISOString().slice(11, 23)
  const tag = `${PREFIX} [${time}] [${level.toUpperCase()}]`
  return [tag, ...args]
}

/**
 * 输出日志
 * @param {string} level
 * @param {any[]} args
 */
function log(level, args) {
  if (LOG_LEVELS[level] < currentLevel) return
  const formatted = formatArgs(level, args)
  const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
  if (typeof console[method] === 'function') {
    console[method](...formatted)
    if (isDev && args.some(a => a instanceof Error)) {
      console.trace?.('Error stack')
    }
  }
}

export const logger = {
  debug(...args) {
    log('debug', args)
  },
  info(...args) {
    log('info', args)
  },
  warn(...args) {
    log('warn', args)
  },
  error(...args) {
    log('error', args)
  },
  /** 包装异步函数，捕获异常并记录 */
  wrapAsync(fn, context = '') {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (err) {
        logger.error(context || fn.name || 'async', err)
        throw err
      }
    }
  }
}

export default logger
