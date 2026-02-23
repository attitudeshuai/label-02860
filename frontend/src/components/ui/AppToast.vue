<template>
  <div class="toast-container" aria-live="polite">
    <transition-group name="toast-slide">
      <div
        v-for="t in toastStore.toasts"
        :key="t.id"
        class="toast-item"
        :class="`toast-${t.type}`"
        role="alert"
      >
        <div class="toast-icon">
          <i :class="iconMap[t.type]"></i>
        </div>
        <span class="toast-message">{{ t.message }}</span>
        <button class="toast-close" @click="toastStore.remove(t.id)" aria-label="关闭">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const iconMap = {
  success: 'bi bi-check-circle-fill',
  danger: 'bi bi-exclamation-circle-fill',
  warning: 'bi bi-exclamation-triangle-fill',
  info: 'bi bi-info-circle-fill'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 84px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 380px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: white;
  box-shadow: var(--shadow-lg);
  border-left: 4px solid;
  min-width: 280px;
}

.toast-success { border-left-color: var(--color-success); }
.toast-danger { border-left-color: var(--color-error); }
.toast-warning { border-left-color: var(--color-warning); }
.toast-info { border-left-color: var(--color-info); }

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.toast-success .toast-icon { color: var(--color-success); }
.toast-danger .toast-icon { color: var(--color-error); }
.toast-warning .toast-icon { color: var(--color-warning); }
.toast-info .toast-icon { color: var(--color-info); }

.toast-message {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-neutral-700);
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  color: var(--color-neutral-400);
  cursor: pointer;
  padding: 2px;
  font-size: 18px;
  line-height: 1;
  transition: color var(--transition-fast);
}

.toast-close:hover {
  color: var(--color-neutral-700);
}

.toast-slide-enter-active {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-leave-active {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(80px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(80px) scale(0.95);
}
</style>
