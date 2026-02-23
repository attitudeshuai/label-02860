/**
 * Toast 提示状态管理
 *
 * 轻量级消息提示，支持 success / info / warning / danger 类型，自动定时消失。
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  /**
   * 展示 Toast
   * @param {string} message - 提示文案
   * @param {'info'|'success'|'warning'|'danger'} [type='info']
   * @param {number} [duration=3000] - 毫秒后自动关闭
   */
  function show(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      remove(id)
    }, duration)
  }

  function remove(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message, duration) {
    show(message, 'success', duration)
  }

  function error(message, duration) {
    show(message, 'danger', duration)
  }

  function warning(message, duration) {
    show(message, 'warning', duration)
  }

  function info(message, duration) {
    show(message, 'info', duration)
  }

  return { toasts, show, remove, success, error, warning, info }
})
