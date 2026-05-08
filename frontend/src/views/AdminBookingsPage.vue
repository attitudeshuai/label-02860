<template>
  <div class="admin-bookings-page py-5">
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4 animate-fade-in-up">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/"><i class="bi bi-house me-1"></i>首页</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">预约审批</li>
        </ol>
      </nav>

      <div class="d-flex align-items-center justify-content-between mb-4 animate-fade-in-up">
        <h2 class="page-title mb-0">
          <i class="bi bi-clipboard-check me-2 text-primary"></i>预约审批
        </h2>
        <div class="admin-stats d-flex gap-3">
          <div class="stat-chip pending-chip">
            <i class="bi bi-hourglass-split me-1"></i>待审批 {{ pendingCount }}
          </div>
          <div class="stat-chip approved-chip">
            <i class="bi bi-check-circle me-1"></i>已确认 {{ approvedCount }}
          </div>
          <div class="stat-chip rejected-chip">
            <i class="bi bi-x-circle me-1"></i>已拒绝 {{ rejectedCount }}
          </div>
        </div>
      </div>

      <div class="filter-bar card animate-fade-in-up mb-4">
        <div class="card-body p-3 d-flex gap-3 flex-wrap align-items-center">
          <div class="filter-group">
            <button
              v-for="f in filters"
              :key="f.value"
              class="btn btn-sm"
              :class="activeFilter === f.value ? 'btn-primary' : 'btn-outline-secondary'"
              @click="activeFilter = f.value"
            >
              {{ f.label }}
            </button>
          </div>
          <div class="ms-auto">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control form-control-sm"
              placeholder="搜索服务名称..."
              style="width: 200px;"
            />
          </div>
        </div>
      </div>

      <div v-if="filteredBookings.length === 0" class="empty-state animate-fade-in-up">
        <i class="bi bi-clipboard2-check"></i>
        <h5>暂无预约记录</h5>
        <p class="text-muted">{{ activeFilter === 'pending' ? '没有待审批的预约' : '没有符合条件的预约' }}</p>
      </div>

      <div v-else class="booking-list">
        <div
          v-for="(bk, index) in filteredBookings"
          :key="bk.id"
          class="card booking-card animate-fade-in-up"
          :class="`stagger-${(index % 8) + 1}`"
        >
          <div class="card-body p-4">
            <div class="row">
              <div class="col-lg-5">
                <div class="d-flex align-items-center gap-3 mb-2 mb-lg-0">
                  <div class="booking-status-icon" :class="`status-${bk.status}`">
                    <i :class="statusIcon(bk.status)"></i>
                  </div>
                  <div>
                    <router-link
                      :to="`/service/${bk.serviceId}`"
                      class="booking-service-title"
                    >
                      {{ bk.serviceTitle }}
                    </router-link>
                    <div class="booking-meta mt-1">
                      <span><i class="bi bi-calendar3 me-1"></i>{{ bk.date }}</span>
                      <span class="ms-3"><i class="bi bi-clock me-1"></i>{{ bk.timeSlot }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 mt-2 mt-lg-0">
                <div class="user-info">
                  <div class="user-mini-avatar">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <div>
                    <div class="fw-medium">{{ getUserName(bk.userId) }}</div>
                    <small class="text-muted">提交于 {{ formatTime(bk.createdAt) }}</small>
                  </div>
                </div>
              </div>
              <div class="col-lg-2 text-lg-center mt-2 mt-lg-0">
                <span class="badge status-badge" :class="statusBadgeClass(bk.status)">
                  {{ statusLabel(bk.status) }}
                </span>
                <div v-if="bk.remark" class="mt-1">
                  <small class="text-muted"><i class="bi bi-chat-dots me-1"></i>有备注</small>
                </div>
              </div>
              <div class="col-lg-2 text-lg-end mt-2 mt-lg-0">
                <div v-if="bk.status === 'pending'" class="action-btns d-flex justify-content-lg-end gap-2">
                  <button class="btn btn-success btn-sm" @click="handleApprove(bk)">
                    <i class="bi bi-check-lg me-1"></i>确认
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="openRejectDialog(bk)">
                    <i class="bi bi-x-lg me-1"></i>拒绝
                  </button>
                </div>
                <div v-else-if="bk.reviewRemark" class="text-muted">
                  <small><i class="bi bi-chat-left-text me-1"></i>{{ bk.reviewRemark }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="showApproveConfirm"
      title="确认预约"
      :message="`确定确认「${targetBooking?.serviceTitle}」的预约申请吗？`"
      type="success"
      confirm-text="确认"
      @confirm="confirmApprove"
      @cancel="showApproveConfirm = false"
    />

    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="showRejectDialog" class="modal-overlay" @click.self="showRejectDialog = false">
          <div class="modal-dialog-custom">
            <div class="modal-header-custom">
              <div class="modal-icon icon-danger">
                <i class="bi bi-x-circle-fill"></i>
              </div>
              <h5 class="modal-title-custom">拒绝预约</h5>
            </div>
            <div class="modal-body-custom">
              <p class="mb-3">拒绝「{{ targetBooking?.serviceTitle }}」的预约申请</p>
              <textarea
                v-model="rejectRemark"
                class="form-control"
                rows="3"
                placeholder="请填写拒绝原因（选填）"
                maxlength="200"
              ></textarea>
            </div>
            <div class="modal-footer-custom">
              <button class="btn btn-outline-secondary btn-sm" @click="showRejectDialog = false">
                取消
              </button>
              <button class="btn btn-danger btn-sm" @click="confirmReject">
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { loadFromStorage, STORAGE_KEYS } from '@/utils/storage'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const bookingStore = useBookingStore()
const userStore = useUserStore()
const toast = useToastStore()

const activeFilter = ref('pending')
const searchQuery = ref('')

const showApproveConfirm = ref(false)
const showRejectDialog = ref(false)
const targetBooking = ref(null)
const rejectRemark = ref('')

const pendingCount = computed(() => bookingStore.bookings.filter(b => b.status === 'pending').length)
const approvedCount = computed(() => bookingStore.bookings.filter(b => b.status === 'approved').length)
const rejectedCount = computed(() => bookingStore.bookings.filter(b => b.status === 'rejected').length)

const filters = [
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '已确认' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'all', label: '全部' }
]

const filteredBookings = computed(() => {
  let list = [...bookingStore.bookings]
  if (activeFilter.value !== 'all') {
    list = list.filter(b => b.status === activeFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(b => b.serviceTitle.toLowerCase().includes(q))
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

function getUserName(userId) {
  try {
    const users = userStore.getAllUsers()
    const user = users.find(u => u.id === userId)
    return user ? user.nickname : `用户${userId}`
  } catch {
    const users = loadFromStorage(STORAGE_KEYS.USERS, [])
    const user = users.find(u => u.id === userId)
    return user ? user.nickname : `用户${userId}`
  }
}

function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function statusLabel(status) {
  const map = { pending: '待审批', approved: '已确认', rejected: '已拒绝', cancelled: '已取消' }
  return map[status] || status
}

function statusBadgeClass(status) {
  const map = {
    pending: 'bg-warning bg-opacity-10 text-warning',
    approved: 'bg-success bg-opacity-10 text-success',
    rejected: 'bg-danger bg-opacity-10 text-danger',
    cancelled: 'bg-secondary bg-opacity-10 text-secondary'
  }
  return map[status] || ''
}

function statusIcon(status) {
  const map = {
    pending: 'bi bi-hourglass-split',
    approved: 'bi bi-check-circle-fill',
    rejected: 'bi bi-x-circle-fill',
    cancelled: 'bi bi-dash-circle-fill'
  }
  return map[status] || 'bi bi-circle'
}

function handleApprove(booking) {
  targetBooking.value = booking
  showApproveConfirm.value = true
}

function confirmApprove() {
  if (!targetBooking.value) return
  const result = bookingStore.approveBooking(targetBooking.value.id)
  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
  showApproveConfirm.value = false
  targetBooking.value = null
}

function openRejectDialog(booking) {
  targetBooking.value = booking
  rejectRemark.value = ''
  showRejectDialog.value = true
}

function confirmReject() {
  if (!targetBooking.value) return
  const result = bookingStore.rejectBooking(targetBooking.value.id, rejectRemark.value)
  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
  showRejectDialog.value = false
  targetBooking.value = null
  rejectRemark.value = ''
}
</script>

<style scoped>
.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-neutral-900);
}

.admin-stats {
  flex-wrap: wrap;
}

.stat-chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.pending-chip {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.approved-chip {
  background: var(--color-success-light);
  color: var(--color-success);
}

.rejected-chip {
  background: var(--color-error-light);
  color: var(--color-error);
}

.filter-group {
  display: flex;
  gap: 8px;
}

.booking-card {
  border: none;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.booking-status-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.status-pending {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-approved {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-rejected {
  background: var(--color-error-light);
  color: var(--color-error);
}

.status-cancelled {
  background: var(--color-neutral-100);
  color: var(--color-neutral-400);
}

.booking-service-title {
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-neutral-800);
  text-decoration: none;
}

.booking-service-title:hover {
  color: var(--color-primary);
}

.booking-meta {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.status-badge {
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.action-btns {
  flex-wrap: wrap;
}

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
  max-width: 420px;
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

.icon-danger {
  background: var(--color-error-light);
  color: var(--color-error);
}

.modal-title-custom {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: var(--font-size-lg);
  color: var(--color-neutral-800);
}

.modal-body-custom {
  padding: 8px 24px 16px;
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

@media (max-width: 768px) {
  .admin-stats {
    width: 100%;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .action-btns {
    flex-wrap: wrap;
  }
}
</style>
