<template>
  <div class="login-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-5">
          <div class="card login-card animate-fade-in-up">
            <div class="card-body p-4 p-md-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <div class="login-icon-wrap">
                  <i class="bi bi-mortarboard-fill"></i>
                </div>
                <h3 class="mt-3 fw-bold">校园生活服务平台</h3>
                <p class="text-muted">{{ isLogin ? '欢迎回来，请登录您的账号' : '创建新账号，开启校园生活' }}</p>
              </div>

              <!-- Tab Switch -->
              <div class="login-tabs mb-4">
                <button
                  :class="['tab-btn', { active: isLogin }]"
                  @click="switchTab(true)"
                >
                  登录
                </button>
                <button
                  :class="['tab-btn', { active: !isLogin }]"
                  @click="switchTab(false)"
                >
                  注册
                </button>
                <div class="tab-indicator" :style="{ left: isLogin ? '0%' : '50%' }"></div>
              </div>

              <!-- Login Form -->
              <form v-if="isLogin" @submit.prevent="handleLogin" novalidate>
                <div class="mb-3">
                  <label class="form-label fw-medium">
                    <i class="bi bi-person me-1"></i>用户名
                  </label>
                  <div class="input-group-custom" :class="{ 'has-error': loginErrors.username }">
                    <span class="input-icon"><i class="bi bi-person"></i></span>
                    <input
                      v-model="loginForm.username"
                      type="text"
                      class="form-control"
                      placeholder="请输入用户名"
                      @blur="validateLoginField('username')"
                      @input="clearError('login', 'username')"
                    />
                  </div>
                  <div v-if="loginErrors.username" class="invalid-feedback d-block">
                    {{ loginErrors.username }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">
                    <i class="bi bi-lock me-1"></i>密码
                  </label>
                  <div class="input-group-custom" :class="{ 'has-error': loginErrors.password }">
                    <span class="input-icon"><i class="bi bi-lock"></i></span>
                    <input
                      v-model="loginForm.password"
                      :type="showLoginPwd ? 'text' : 'password'"
                      class="form-control"
                      placeholder="请输入密码"
                      @blur="validateLoginField('password')"
                      @input="clearError('login', 'password')"
                    />
                    <button
                      type="button"
                      class="toggle-pwd"
                      @click="showLoginPwd = !showLoginPwd"
                      tabindex="-1"
                    >
                      <i :class="showLoginPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="loginErrors.password" class="invalid-feedback d-block">
                    {{ loginErrors.password }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 btn-lg"
                  :disabled="loading"
                >
                  <span v-if="loading" class="loading-spinner me-2"></span>
                  {{ loading ? '登录中...' : '登 录' }}
                </button>
              </form>

              <!-- Register Form -->
              <form v-else @submit.prevent="handleRegister" novalidate>
                <div class="mb-3">
                  <label class="form-label fw-medium">
                    <i class="bi bi-person me-1"></i>用户名
                  </label>
                  <div class="input-group-custom" :class="{ 'has-error': registerErrors.username }">
                    <span class="input-icon"><i class="bi bi-person"></i></span>
                    <input
                      v-model="registerForm.username"
                      type="text"
                      class="form-control"
                      placeholder="3-20 个字符"
                      @blur="validateRegisterField('username')"
                      @input="clearError('register', 'username')"
                    />
                  </div>
                  <div v-if="registerErrors.username" class="invalid-feedback d-block">
                    {{ registerErrors.username }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">
                    <i class="bi bi-person-badge me-1"></i>昵称
                  </label>
                  <div class="input-group-custom" :class="{ 'has-error': registerErrors.nickname }">
                    <span class="input-icon"><i class="bi bi-person-badge"></i></span>
                    <input
                      v-model="registerForm.nickname"
                      type="text"
                      class="form-control"
                      placeholder="2-16 个字符"
                      @blur="validateRegisterField('nickname')"
                      @input="clearError('register', 'nickname')"
                    />
                  </div>
                  <div v-if="registerErrors.nickname" class="invalid-feedback d-block">
                    {{ registerErrors.nickname }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">
                    <i class="bi bi-envelope me-1"></i>邮箱
                  </label>
                  <div class="input-group-custom" :class="{ 'has-error': registerErrors.email }">
                    <span class="input-icon"><i class="bi bi-envelope"></i></span>
                    <input
                      v-model="registerForm.email"
                      type="email"
                      class="form-control"
                      placeholder="example@campus.edu.cn"
                      @blur="validateRegisterField('email')"
                      @input="clearError('register', 'email')"
                    />
                  </div>
                  <div v-if="registerErrors.email" class="invalid-feedback d-block">
                    {{ registerErrors.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">
                    <i class="bi bi-lock me-1"></i>密码
                  </label>
                  <div class="input-group-custom" :class="{ 'has-error': registerErrors.password }">
                    <span class="input-icon"><i class="bi bi-lock"></i></span>
                    <input
                      v-model="registerForm.password"
                      :type="showRegPwd ? 'text' : 'password'"
                      class="form-control"
                      placeholder="6-20 个字符"
                      @blur="validateRegisterField('password')"
                      @input="clearError('register', 'password')"
                    />
                    <button
                      type="button"
                      class="toggle-pwd"
                      @click="showRegPwd = !showRegPwd"
                      tabindex="-1"
                    >
                      <i :class="showRegPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="registerErrors.password" class="invalid-feedback d-block">
                    {{ registerErrors.password }}
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">
                    <i class="bi bi-lock-fill me-1"></i>确认密码
                  </label>
                  <div class="input-group-custom" :class="{ 'has-error': registerErrors.confirmPassword }">
                    <span class="input-icon"><i class="bi bi-lock-fill"></i></span>
                    <input
                      v-model="registerForm.confirmPassword"
                      :type="showRegPwd ? 'text' : 'password'"
                      class="form-control"
                      placeholder="再次输入密码"
                      @blur="validateRegisterField('confirmPassword')"
                      @input="clearError('register', 'confirmPassword')"
                    />
                  </div>
                  <div v-if="registerErrors.confirmPassword" class="invalid-feedback d-block">
                    {{ registerErrors.confirmPassword }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 btn-lg"
                  :disabled="loading"
                >
                  <span v-if="loading" class="loading-spinner me-2"></span>
                  {{ loading ? '注册中...' : '注 册' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateNickname
} from '@/utils/validators'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const toast = useToastStore()

const isLogin = ref(true)
const loading = ref(false)
const showLoginPwd = ref(false)
const showRegPwd = ref(false)

const loginForm = reactive({ username: '', password: '' })
const loginErrors = reactive({ username: '', password: '' })

const registerForm = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const registerErrors = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function switchTab(login) {
  isLogin.value = login
  Object.keys(loginErrors).forEach(k => loginErrors[k] = '')
  Object.keys(registerErrors).forEach(k => registerErrors[k] = '')
}

onMounted(() => {
  if (route.query.tab === 'register') {
    switchTab(false)
  }
})

function clearError(form, field) {
  if (form === 'login') loginErrors[field] = ''
  else registerErrors[field] = ''
}

function validateLoginField(field) {
  if (field === 'username') {
    loginErrors.username = validateUsername(loginForm.username)
  }
  if (field === 'password') {
    loginErrors.password = validatePassword(loginForm.password)
  }
}

function validateRegisterField(field) {
  if (field === 'username') {
    registerErrors.username = validateUsername(registerForm.username)
  }
  if (field === 'nickname') {
    registerErrors.nickname = validateNickname(registerForm.nickname)
  }
  if (field === 'email') {
    registerErrors.email = validateEmail(registerForm.email)
  }
  if (field === 'password') {
    registerErrors.password = validatePassword(registerForm.password)
  }
  if (field === 'confirmPassword') {
    if (!registerForm.confirmPassword) {
      registerErrors.confirmPassword = '请再次输入密码'
    } else if (registerForm.confirmPassword !== registerForm.password) {
      registerErrors.confirmPassword = '两次输入的密码不一致'
    } else {
      registerErrors.confirmPassword = ''
    }
  }
}

function validateLoginForm() {
  validateLoginField('username')
  validateLoginField('password')
  return !loginErrors.username && !loginErrors.password
}

function validateRegisterForm() {
  validateRegisterField('username')
  validateRegisterField('nickname')
  validateRegisterField('email')
  validateRegisterField('password')
  validateRegisterField('confirmPassword')
  return !registerErrors.username && !registerErrors.nickname &&
    !registerErrors.email && !registerErrors.password && !registerErrors.confirmPassword
}

async function handleLogin() {
  if (!validateLoginForm()) return

  loading.value = true
  await new Promise(r => setTimeout(r, 600))

  const result = userStore.login(loginForm.username, loginForm.password)
  loading.value = false

  if (result.success) {
    toast.success(result.message)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    toast.error(result.message)
  }
}

async function handleRegister() {
  if (!validateRegisterForm()) return

  loading.value = true
  await new Promise(r => setTimeout(r, 600))

  const result = userStore.register({
    username: registerForm.username,
    nickname: registerForm.nickname,
    email: registerForm.email,
    password: registerForm.password
  })
  loading.value = false

  if (result.success) {
    toast.success(result.message)
    switchTab(true)
    loginForm.username = registerForm.username
    loginForm.password = ''
  } else {
    toast.error(result.message)
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
}

.login-card {
  border: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  background: var(--bg-card);
}

.login-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 28px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.login-tabs {
  display: flex;
  position: relative;
  background: var(--color-neutral-100);
  border-radius: var(--radius-lg);
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: none;
  font-weight: 600;
  color: var(--color-neutral-500);
  cursor: pointer;
  border-radius: var(--radius-md);
  position: relative;
  z-index: 1;
  transition: color var(--transition-fast);
}

.tab-btn.active {
  color: var(--color-primary);
}

.tab-indicator {
  position: absolute;
  top: 4px;
  width: 50%;
  height: calc(100% - 8px);
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: left var(--transition-normal);
}

.input-group-custom {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  background: white;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input-group-custom:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.input-group-custom.has-error {
  border-color: var(--color-error);
}

.input-group-custom.has-error:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  flex-shrink: 0;
  color: var(--color-neutral-400);
  font-size: 16px;
}

.input-group-custom .form-control {
  flex: 1;
  height: 44px;
  border: none;
  background: transparent;
  font-size: var(--font-size-sm);
  padding: 0;
  box-shadow: none !important;
}

.input-group-custom .form-control:focus {
  box-shadow: none !important;
  outline: none;
}

.toggle-pwd {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-neutral-400);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.toggle-pwd:hover {
  color: var(--color-neutral-600);
}

.btn-lg {
  height: 48px;
  font-weight: 600;
  font-size: var(--font-size-base);
  border-radius: var(--radius-lg);
}
</style>
