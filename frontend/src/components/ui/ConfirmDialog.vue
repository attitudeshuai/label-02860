<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-dialog-custom">
          <div class="modal-header-custom">
            <div class="modal-icon" :class="`icon-${type}`">
              <i :class="iconMap[type]"></i>
            </div>
            <h5 class="modal-title-custom">{{ title }}</h5>
          </div>
          <div class="modal-body-custom">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer-custom">
            <button class="btn btn-outline-secondary btn-sm" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button class="btn btn-primary btn-sm" @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '确认操作' },
  message: { type: String, default: '确认要执行此操作吗？' },
  type: { type: String, default: 'warning' },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' }
})

const emit = defineEmits(['confirm', 'cancel'])

const iconMap = {
  warning: 'bi bi-exclamation-triangle-fill',
  danger: 'bi bi-exclamation-circle-fill',
  info: 'bi bi-info-circle-fill',
  success: 'bi bi-check-circle-fill'
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-dialog-custom {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 400px;
  width: 90%;
  overflow: hidden;
  animation: modalEnter 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header-custom {
  padding: 24px 24px 8px;
  text-align: center;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 24px;
}

.icon-warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.icon-danger {
  background: var(--color-error-light);
  color: var(--color-error);
}

.icon-info {
  background: var(--color-info-light);
  color: var(--color-info);
}

.icon-success {
  background: var(--color-success-light);
  color: var(--color-success);
}

.modal-title-custom {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: var(--font-size-lg);
  color: var(--color-neutral-800);
}

.modal-body-custom {
  padding: 8px 24px 16px;
  text-align: center;
  color: var(--color-neutral-600);
  font-size: var(--font-size-sm);
}

.modal-footer-custom {
  padding: 12px 24px 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-footer-custom .btn {
  min-width: 80px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
