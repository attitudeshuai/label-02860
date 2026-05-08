<template>
  <div class="admin-bookings-page py-5">
    <div class="container">
      <div class="mb-4 animate-fade-in-up d-flex justify-content-between align-items-center">
        <h2 class="section-title mb-0">
          <i class="bi bi-clipboard-check me-2 text-primary"></i>预约管理
        </h2>
        <div class="stats-bar d-flex gap-4">
          <div class="stat-item">
            <span class="stat-label">待审核</span>
            <span class="stat-value text-warning">{{ bookingStore.pendingBookings.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">已通过</span>
            <span class="stat-value text-success">{{ bookingStore.approvedBookings.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">已拒绝</span>
            <span class="stat-value text-danger">{{ bookingStore.rejectedBookings.length }}</span>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-3">
          <div class="card animate-fade-in-up">
            <div class="card-body p-3">
              <div class="filter-item" :class="{ active: currentFilter === 'pending' }" @click="currentFilter = 'pending'">
                <i class="bi bi-clock text-warning"></i>
                <span>待审核</span>
                <span class="badge bg-warning ms-auto text-dark">{{ bookingStore.pendingBookings.length }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'approved' }" @click="currentFilter = 'approved'">
                <i class="bi bi-check-circle text-success"></i>
                <span>已通过</span>
                <span class="badge bg-success ms-auto">{{ bookingStore.approvedBookings.length }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'rejected' }" @click="currentFilter = 'rejected'">
                <i class="bi bi-x-circle text-danger"></i>
                <span>已拒绝</span>
                <span class="badge bg-danger ms-auto">{{ bookingStore.rejectedBookings.length }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'cancelled' }" @click="currentFilter = 'cancelled'">
                <i class="bi bi-slash-circle text-secondary"></i>
                <span>已取消</span>
                <span class="badge bg-secondary ms-auto">{{ cancelledCount }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">
                <i class="bi bi-list-ul"></i>
                <span>全部预约</span>
                <span class="badge bg-secondary ms-auto">{{ bookingStore.bookings.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div v-if="filteredBookings.length === 0" class="card animate-fade-in-up">
            <div class="card-body text-center py-5">
              <i class="bi bi-calendar-x text-muted" style="font-size: 64px;"></i>
              <h5 class="mt-3 mb-2">暂无预约</h5>
              <p class="text-muted">当前筛选条件下没有预约记录</p>
            </div>
          </div>

          <div v-else class="booking-list">
            <div
              v-for="(booking, index) in filteredBookings"
              :key="booking.id"
              class="card animate-fade-in-up"
              :class="`stagger-${Math.min(index + 1, 6)}`"
            >
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 class="mb-1">{{ booking.serviceTitle }}</h5>
                    <div class="booking-user">
                      <i class="bi bi-person me-1"></i>{{ booking.userName }}
                      <span v-if="booking.userPhone" class="ms-2">
                        <i class="bi bi-telephone me-1"></i>{{ booking.userPhone }}
                      </span>
                      <span v-if="booking.userEmail" class="ms-2">
                        <i class="bi bi-envelope me-1"></i>{{ booking.userEmail }}
                      </span>
                    </div>
                  </div>
                  <span
                    class="badge"
                    :class="getStatusClass(booking.status)"
                  >
                    <i :class="getStatusIcon(booking.status)" class="me-1"></i>
                    {{ BOOKING_STATUS_LABELS[booking.status] }}
                  </span>
                </div>

                <div class="booking-meta mb-3">
                  <span><i class="bi bi-calendar me-1"></i>预约日期：{{ booking.date }}</span>
                  <span><i class="bi bi-clock me-1"></i>时间段：{{ booking.timeSlot }}</span>
                </div>

                <div v-if="booking.notes" class="notes-section mb-3">
                  <small class="text-muted"><i class="bi bi-chat-text me-1"></i>用户备注：</small>
                  <p class="mb-0 mt-1">{{ booking.notes }}</p>
                </div>

                <div v-if="booking.reviewNote" class="review-note mb-3">
                  <small class="text-muted"><i class="bi bi-info-circle me-1"></i>处理回复：</small>
                  <p class="mb-0 mt-1">{{ booking.reviewNote }}</p>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    提交时间：{{ formatDate(booking.createdAt) }}
                    <span v-if="booking.reviewedAt" class="ms-3">
                      处理时间：{{ formatDate(booking.reviewedAt) }}
                    </span>
                  </small>

                  <div v-if="booking.status === 'pending'" class="d-flex gap-2">
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="showRejectModal(booking)"
                    >
                      <i class="bi bi-x-circle me-1"></i>拒绝
                    </button>
                    <button
                      class="btn btn-sm btn-success"
                      @click="handleApprove(booking)"
                    >
                      <i class="bi bi-check-circle me-1"></i>通过
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="showRejectDialog" @click.self="closeRejectModal">
      <div class="modal-content card">
        <div class="card-body">
          <h5 class="card-title mb-3">
            <i class="bi bi-x-circle text-danger me-2"></i>拒绝预约
          </h5>
          <p class="text-muted mb-3">请填写拒绝原因（可选）：</p>
          <textarea
            v-model="rejectNote"
            class="form-control"
            rows="3"
            placeholder="请说明拒绝原因..."
            maxlength="200"
          ></textarea>
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary" @click="closeRejectModal">
              取消
            </button>
            <button class="btn btn-danger" @click="handleReject">
              <i class="bi bi-check2 me-1"></i>确认拒绝
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useBookingStore, BOOKING_STATUS, BOOKING_STATUS_LABELS } from '@/stores/booking'
import { useToastStore } from '@/stores/toast'

const userStore = useUserStore()
const bookingStore = useBookingStore()
const toast = useToastStore()

const currentFilter = ref('pending')
const showRejectDialog = ref(false)
const bookingToReject = ref(null)
const rejectNote = ref('')

const cancelledCount = computed(() =>
  bookingStore.bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length
)

const filteredBookings = computed(() => {
  if (currentFilter.value === 'all') {
    return [...bookingStore.bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }
  return bookingStore.bookings
    .filter(b => b.status === currentFilter.value)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

function getStatusClass(status) {
  const classes = {
    [BOOKING_STATUS.PENDING]: 'bg-warning bg-opacity-10 text-warning',
    [BOOKING_STATUS.APPROVED]: 'bg-success bg-opacity-10 text-success',
    [BOOKING_STATUS.REJECTED]: 'bg-danger bg-opacity-10 text-danger',
    [BOOKING_STATUS.CANCELLED]: 'bg-secondary bg-opacity-10 text-secondary'
  }
  return classes[status] || 'bg-secondary bg-opacity-10 text-secondary'
}

function getStatusIcon(status) {
  const icons = {
    [BOOKING_STATUS.PENDING]: 'bi bi-clock',
    [BOOKING_STATUS.APPROVED]: 'bi bi-check-circle',
    [BOOKING_STATUS.REJECTED]: 'bi bi-x-circle',
    [BOOKING_STATUS.CANCELLED]: 'bi bi-slash-circle'
  }
  return icons[status] || 'bi bi-circle'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleApprove(booking) {
  const result = bookingStore.approveBooking(
    booking.id,
    '预约已审核通过，请按时前往',
    userStore.currentUser?.nickname || userStore.currentUser?.username || '管理员'
  )
  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
}

function showRejectModal(booking) {
  bookingToReject.value = booking
  rejectNote.value = ''
  showRejectDialog.value = true
}

function closeRejectModal() {
  showRejectDialog.value = false
  bookingToReject.value = null
  rejectNote.value = ''
}

function handleReject() {
  if (!bookingToReject.value) return

  const result = bookingStore.rejectBooking(
    bookingToReject.value.id,
    rejectNote.value || '预约被拒绝',
    userStore.currentUser?.nickname || userStore.currentUser?.username || '管理员'
  )
  closeRejectModal()

  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
}
</script>

<style scoped>
.stats-bar {
  background: white;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
  font-weight: 500;
}

.filter-item:hover {
  background: var(--color-neutral-50);
}

.filter-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.booking-user {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
}

.booking-meta {
  display: flex;
  gap: 24px;
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
}

.notes-section,
.review-note {
  padding: 10px 14px;
  background: var(--color-neutral-50);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
}

.review-note {
  border-left: 3px solid var(--color-primary);
  background: var(--color-primary-50);
}

.booking-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 480px;
  margin: 20px;
}

@media (max-width: 768px) {
  .booking-meta {
    flex-direction: column;
    gap: 4px;
  }

  .stats-bar {
    display: none;
  }
}
</style>
