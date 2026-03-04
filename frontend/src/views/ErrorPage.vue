<template>
  <div class="error-page d-flex align-items-center justify-content-center">
    <div class="text-center">
      <div class="error-icon mb-4">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h2 class="mb-3">页面出错了</h2>
      <p class="text-muted mb-4">
        {{ errorMessage }}
      </p>
      <div class="d-flex gap-3 justify-content-center">
        <button class="btn btn-primary" @click="goHome">
          <i class="bi bi-house me-2"></i>返回首页
        </button>
        <button class="btn btn-outline-secondary" @click="retry">
          <i class="bi bi-arrow-clockwise me-2"></i>重试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const errorMessage = computed(() => {
  return route.query.message || '抱歉，页面加载出现问题，请稍后再试。'
})

function goHome() {
  router.replace({ name: 'home' })
}

function retry() {
  const from = route.query.from
  if (from) {
    router.replace(from)
  } else {
    router.replace({ name: 'home' })
  }
}
</script>

<style scoped>
.error-page {
  min-height: 70vh;
  padding: 40px 20px;
}

.error-icon {
  font-size: 72px;
  color: var(--color-accent, #f59e0b);
}

.error-page h2 {
  font-weight: 700;
  color: var(--color-neutral-800, #1f2937);
}
</style>
