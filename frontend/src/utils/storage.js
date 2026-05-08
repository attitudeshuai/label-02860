/**
 * localStorage 工具
 *
 * 封装本地存储的读写删，统一 JSON 序列化，异常时回退默认值并记录日志。
 */

import { logger } from './logger'

/** 存储键名常量，避免魔法字符串 */
export const STORAGE_KEYS = {
  USER: 'campus_current_user',
  USERS: 'campus_users',
  TOKEN: 'campus_token',
  BOOKINGS: 'campus_bookings',
  BOOKING_VERSION: 'campus_bookings_version'
}

/**
 * 写入存储
 * @param {string} key - 键名
 * @param {any} value - 将自动 JSON.stringify
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    logger.warn('localStorage 写入失败', key, e)
  }
}

/**
 * 读取存储
 * @param {string} key
 * @param {any} [defaultValue=null] - 解析失败或不存在时返回
 * @returns {any}
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (e) {
    logger.warn('localStorage 读取失败', key, e)
    return defaultValue
  }
}

/**
 * 删除存储项
 * @param {string} key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    logger.warn('localStorage 删除失败', key, e)
  }
}
