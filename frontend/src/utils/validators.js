/**
 * 表单验证工具
 *
 * 各函数返回空字符串表示通过，否则返回错误提示文案。
 */

/**
 * 校验用户名：3-20 字符，仅允许字母、数字、下划线、中文
 * @param {string} value
 * @returns {string} 错误信息，空表示通过
 */
export function validateUsername(value) {
  if (!value || !value.trim()) return '请输入用户名'
  if (value.length < 3 || value.length > 20) return '用户名长度为 3-20 个字符'
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) return '用户名只能包含字母、数字、下划线和中文'
  return ''
}

/**
 * 校验密码：6-20 字符
 * @param {string} value
 * @returns {string}
 */
export function validatePassword(value) {
  if (!value) {
    return '请输入密码'
  }
  if (value.length < 6 || value.length > 20) {
    return '密码长度为 6-20 个字符'
  }
  return ''
}

/**
 * 校验邮箱格式
 * @param {string} value
 * @returns {string}
 */
export function validateEmail(value) {
  if (!value || !value.trim()) return '请输入邮箱'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入有效的邮箱地址'
  return ''
}

/**
 * 校验手机号：1 开头 11 位数字
 * @param {string} value
 * @returns {string}
 */
export function validatePhone(value) {
  if (!value || !value.trim()) return '请输入手机号'
  if (!/^1[3-9]\d{9}$/.test(value)) return '请输入有效的手机号'
  return ''
}

/**
 * 校验昵称：2-16 字符
 * @param {string} value
 * @returns {string}
 */
export function validateNickname(value) {
  if (!value || !value.trim()) return '请输入昵称'
  if (value.length < 2 || value.length > 16) return '昵称长度为 2-16 个字符'
  return ''
}
