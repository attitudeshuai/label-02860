/**
 * 校园生活服务平台 - 应用入口
 *
 * 初始化 Vue 应用、Pinia 状态、路由，并注册全局异常处理与日志框架。
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { installErrorHandler } from '@/utils/errorHandler'
import { logger } from '@/utils/logger'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

/** 注册全局异常处理（Vue 错误、Promise 拒绝、路由导航错误） */
installErrorHandler(app, router)

app.mount('#app')

logger.info('应用已启动')
