/**
 * 路由配置
 *
 * 定义页面路由、元信息，以及全局导航守卫（权限校验、标题设置）。
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/service/:id',
    name: 'service-detail',
    component: () => import('@/views/ServiceDetailPage.vue'),
    meta: { title: '服务详情' },
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: '登录/注册', guest: true }
  },
  {
    path: '/announcements',
    name: 'announcement-list',
    component: () => import('@/views/AnnouncementListPage.vue'),
    meta: { title: '公告列表' }
  },
  {
    path: '/profile',
    name: 'personal-center',
    component: () => import('@/views/PersonalCenterPage.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/campus-map',
    name: 'campus-map',
    component: () => import('@/views/CampusMapPage.vue'),
    meta: { title: '校园地图' }
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorPage.vue'),
    meta: { title: '页面出错' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

/** 全局前置守卫：设置页面标题、鉴权、已登录用户访问登录页时重定向首页 */
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '校园生活服务平台'} - 校园生活服务平台`
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guest && userStore.isLoggedIn) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
