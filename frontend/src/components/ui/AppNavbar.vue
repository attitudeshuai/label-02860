<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top app-navbar">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <i class="bi bi-mortarboard-fill me-2 brand-icon"></i>
        <span class="brand-text">校园生活服务平台</span>
      </router-link>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="切换导航"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: $route.path === '/' }"
              to="/"
            >
              <i class="bi bi-house-door me-1"></i>首页
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/announcements">
              <i class="bi bi-megaphone me-1"></i>公告
            </router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <template v-if="userStore.isLoggedIn">
            <router-link
              to="/profile"
              class="nav-user-btn d-flex align-items-center text-white text-decoration-none"
            >
              <div class="user-avatar me-2">
                <i class="bi bi-person-fill"></i>
              </div>
              <span class="d-none d-md-inline">{{ userStore.currentUser?.nickname }}</span>
            </router-link>
            <button class="btn btn-outline-light btn-sm logout-btn" @click="handleLogout">
              <i class="bi bi-box-arrow-right me-1"></i>退出
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-light btn-sm login-btn">
              <i class="bi bi-person me-1"></i>登录 / 注册
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

function handleLogout() {
  userStore.logout()
  toast.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.app-navbar {
  background: var(--bg-navbar);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  padding: 12px 0;
  z-index: 1030;
}

.brand-icon {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.brand-text {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
}

.nav-link {
  font-weight: 500;
  padding: 8px 16px !important;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  margin: 0 2px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.18);
  font-weight: 600;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background var(--transition-fast);
}

.nav-user-btn:hover .user-avatar {
  background: rgba(255, 255, 255, 0.3);
}

.login-btn {
  font-weight: 600;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.logout-btn {
  border-radius: var(--radius-full);
  padding: 4px 12px;
  font-size: 13px;
}
</style>
