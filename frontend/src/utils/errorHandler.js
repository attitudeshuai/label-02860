/**
 * 统一异常处理
 *
 * 注册全局错误捕获：Vue 渲染错误、未处理的 Promise 拒绝、路由导航错误。
 * 所有异常统一记录到日志，部分场景可向用户展示 Toast 提示。
 *
 * @usage 在 main.js 中调用 installErrorHandler(app, router)
 */

import { logger } from './logger'

/** 是否已安装（避免重复注册） */
let installed = false

/** 用户可见错误信息映射，避免向用户暴露技术细节 */
const USER_MESSAGES = {
  default: '操作失败，请稍后重试',
  network: '网络异常，请检查连接',
  auth: '登录已失效，请重新登录'
}

/**
 * 从 Error 或字符串中提取用户友好提示
 * @param {Error|string} err
 * @returns {string}
 */
function getUserMessage(err) {
  if (typeof err === 'string') return err
  if (err?.message) {
    const msg = err.message.toLowerCase()
    if (msg.includes('network') || msg.includes('fetch')) return USER_MESSAGES.network
    if (msg.includes('401') || msg.includes('unauthorized')) return USER_MESSAGES.auth
  }
  return USER_MESSAGES.default
}

/**
 * 记录异常详情（含堆栈）
 * @param {string} source - 错误来源标识
 * @param {Error|unknown} err
 * @param {Object} [extra] - 额外上下文
 */
function recordError(source, err, extra = {}) {
  const error = err instanceof Error ? err : new Error(String(err))
  logger.error(`[${source}]`, error.message, error.stack || '', extra)
}

/**
 * Vue 全局错误处理器
 * @param {Error} err - 抛出的错误
 * @param {Component} instance - 出错组件实例
 * @param {string} info - Vue 提供的错误信息
 */
function vueErrorHandler(err, instance, info) {
  recordError('Vue', err, { info, component: instance?.$?.type?.name || instance?.type?.name })
  // 开发环境下可考虑使用 useToastStore 提示，此处仅记录避免打扰用户
}

/**
 * 未处理 Promise 拒绝处理器
 * @param {PromiseRejectionEvent} event
 */
function unhandledRejectionHandler(event) {
  const err = event?.reason
  recordError('UnhandledRejection', err ?? 'Unknown rejection')
  event.preventDefault?.()
  // 防止默认控制台输出，我们已记录
}

/**
 * 安装全局异常处理
 * @param {import('vue').App} app - Vue 应用实例
 * @param {import('vue-router').Router} [router] - 路由实例，可选
 */
export function installErrorHandler(app, router) {
  if (installed) {
    logger.warn('错误处理器已安装，跳过重复注册')
    return
  }

  app.config.errorHandler = vueErrorHandler

  window.addEventListener('unhandledrejection', unhandledRejectionHandler)

  if (router) {
    router.onError((err) => {
      recordError('Router', err, { to: err?.to?.fullPath, from: err?.from?.fullPath })
      // 避免导航失败时卡住
      throw err
    })
  }

  installed = true
  logger.info('统一异常处理已注册')
}

/**
 * 业务层安全执行包装器：捕获异常、记录日志、返回结果对象
 * 适用于 async 业务函数，无需每处 try/catch
 *
 * @param {() => Promise<T>} fn - 异步业务函数
 * @param {string} [context] - 上下文标识，用于日志
 * @returns {Promise<{ ok: boolean, data?: T, error?: string }>}
 *
 * @example
 *   const { ok, data } = await runSafe(() => api.fetchList(), 'fetchList')
 *   if (!ok) toast.error('加载失败'); return
 *   list.value = data
 */
export async function runSafe(fn, context = 'runSafe') {
  try {
    const data = await fn()
    return { ok: true, data }
  } catch (err) {
    recordError(context, err)
    return { ok: false, error: getUserMessage(err) }
  }
}

export { getUserMessage }
