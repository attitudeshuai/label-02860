<template>
  <div class="app-wrapper">
    <AppNavbar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import AppToast from '@/components/ui/AppToast.vue'
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 72px;
}
</style>
