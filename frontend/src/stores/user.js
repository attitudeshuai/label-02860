/**
 * 用户状态管理
 *
 * 负责登录、注册、登出、资料更新，数据持久化到 localStorage。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockUsers } from '@/data/mock'
import { saveToStorage, loadFromStorage, removeFromStorage, STORAGE_KEYS } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  /** 当前登录用户（不含密码） */
  const currentUser = ref(loadFromStorage(STORAGE_KEYS.USER, null))
  /** 登录令牌 */
  const token = ref(loadFromStorage(STORAGE_KEYS.TOKEN, ''))

  const isLoggedIn = computed(() => !!currentUser.value && !!token.value)
  const userRole = computed(() => currentUser.value?.role || '')

  /** 初始化用户数据：若 localStorage 无用户表则写入 mock 数据 */
  function initUsers() {
    const stored = loadFromStorage(STORAGE_KEYS.USERS, null)
    if (!stored) {
      saveToStorage(STORAGE_KEYS.USERS, mockUsers)
    }
  }

  function getAllUsers() {
    return loadFromStorage(STORAGE_KEYS.USERS, mockUsers)
  }

  /**
   * 登录
   * @param {string} username
   * @param {string} password
   * @returns {{ success: boolean, message: string, user?: object }}
   */
  function login(username, password) {
    const users = getAllUsers()
    const user = users.find(
      u => u.username === username && u.password === password
    )
    if (!user) {
      return { success: false, message: '用户名或密码错误' }
    }

    const tokenValue = `token_${user.id}_${Date.now()}`
    const safeUser = { ...user }
    delete safeUser.password

    currentUser.value = safeUser
    token.value = tokenValue
    saveToStorage(STORAGE_KEYS.USER, safeUser)
    saveToStorage(STORAGE_KEYS.TOKEN, tokenValue)

    return { success: true, message: '登录成功', user: safeUser }
  }

  /**
   * 注册新用户
   * @param {object} userInfo - { username, password, nickname?, email?, phone? }
   * @returns {{ success: boolean, message: string }}
   */
  function register(userInfo) {
    const users = getAllUsers()

    if (users.some(u => u.username === userInfo.username)) {
      return { success: false, message: '用户名已存在' }
    }

    const newUser = {
      id: Date.now(),
      username: userInfo.username,
      password: userInfo.password,
      nickname: userInfo.nickname || userInfo.username,
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      avatar: '',
      role: 'user'
    }

    users.push(newUser)
    saveToStorage(STORAGE_KEYS.USERS, users)

    return { success: true, message: '注册成功，请登录' }
  }

  /** 登出：清空用户与 token，移除本地存储 */
  function logout() {
    currentUser.value = null
    token.value = ''
    removeFromStorage(STORAGE_KEYS.USER)
    removeFromStorage(STORAGE_KEYS.TOKEN)
  }

  /**
   * 更新当前用户资料
   * @param {object} profile - 要更新的字段（nickname, email, phone 等）
   * @returns {{ success: boolean, message: string }}
   */
  function updateProfile(profile) {
    const users = getAllUsers()
    const index = users.findIndex(u => u.id === currentUser.value.id)
    if (index === -1) {
      return { success: false, message: '用户不存在' }
    }

    const updatedUser = { ...users[index], ...profile }
    users[index] = updatedUser
    saveToStorage(STORAGE_KEYS.USERS, users)

    const safeUser = { ...updatedUser }
    delete safeUser.password
    currentUser.value = safeUser
    saveToStorage(STORAGE_KEYS.USER, safeUser)

    return { success: true, message: '资料更新成功' }
  }

  initUsers()

  return {
    currentUser,
    token,
    isLoggedIn,
    userRole,
    login,
    register,
    logout,
    updateProfile
  }
})
