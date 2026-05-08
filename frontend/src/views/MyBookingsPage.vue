<template>
  <div class="my-bookings-page py-5">
    <div class="container">
      <div class="mb-4 animate-fade-in-up">
        <h2 class="section-title">
          <i class="bi bi-calendar-event me-2 text-primary"></i>我的预约
        </h2>
      </div>

      <div class="row g-4">
        <div class="col-lg-3">
          <div class="card animate-fade-in-up">
            <div class="card-body p-3">
              <div class="filter-item" :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">
                <i class="bi bi-list-ul"></i>
                <span>全部预约</span>
                <span class="badge bg-secondary ms-auto">{{ myBookings.length }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'pending' }" @click="currentFilter = 'pending'">
                <i class="bi bi-clock text-warning"></i>
                <span>待审核</span>
                <span class="badge bg-warning ms-auto text-dark">{{ pendingCount }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'approved' }" @click="currentFilter = 'approved'">
                <i class="bi bi-check-circle text-success"></i>
                <span>已通过</span>
                <span class="badge bg-success ms-auto">{{ approvedCount }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'rejected' }" @click="currentFilter = 'rejected'">
                <i class="bi bi-x-circle text-danger"></i>
                <span>已拒绝</span>
                <span class="badge bg-danger ms-auto">{{ rejectedCount }}</span>
              </div>
              <div class="filter-item" :class="{ active: currentFilter === 'cancelled' }" @click="currentFilter = 'cancelled'">
                <i class="bi bi-slash-circle text-secondary"></i>
                <span>已取消</span>
                <span class="badge bg-secondary ms-auto">{{ cancelledCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div v-if="filteredBookings.length === 0" class="card animate-fade-in-up">
            <div class="card-body text-center py-5">
              <i class="bi bi-calendar-x text-muted" style="font-size: 64px;"></i>
              <h5 class="mt-3 mb-2">暂无预约记录</h5>
              <p class="text-muted mb-4">您还没有相关的预约记录</p>
              <router-link to="/" class="btn btn-primary">
                <i class="bi bi-grid me-2"></i>浏览服务
              </router-link>
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
                    <div class="booking-meta">
                      <span><i class="bi bi-calendar me-1"></i>{{ booking.date }}</span>
                      <span><i class="bi bi-clock me-1"></i>{{ booking.timeSlot }}</span>
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

                <div v-if="booking.notes" class="notes-section mb-3">
                  <small class="text-muted"><i class="bi bi-chat-text me-1"></i>备注：</small>
                  <p class="mb-0 mt-1">{{ booking.notes }}</p>
                </div>

                <div v-if="booking.reviewNote" class="review-note mb-3">
                  <small class="text-muted"><i class="bi bi-info-circle me-1"></i>管理员回复：</small>
                  <p class="mb-0 mt-1">{{ booking.reviewNote }}</p>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    提交时间：{{ formatDate(booking.createdAt) }}
                  </small>
                  <div v-if="booking.status === 'pending'" class="gap-2">
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="showCancelConfirm(booking)"
                    >
                      <i class="bi bi-x-circle me-1"></i>取消预约
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="showCancelModal"
      title="取消预约"
      :message="`确定要取消 ${bookingToCancel?.serviceTitle} 的预约吗？`"
      type="warning"
      confirm-text="确认取消"
      @confirm="handleCancelBooking"
      @cancel="showCancelModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useBookingStore, BOOKING_STATUS, BOOKING_STATUS_LABELS } from '@/stores/booking'
import { useToastStore } from '@/stores/toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const userStore = useUserStore()
const bookingStore = useBookingStore()
const toast = useToastStore()

const currentFilter = ref('all')
const showCancelModal = ref(false)
const bookingToCancel = ref(null)

const myBookings = computed(() =>
  bookingStore.getBookingsByUserId(userStore.currentUser.id).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
)

const pendingCount = computed(() =>
  myBookings.value.filter(b => b.status === BOOKING_STATUS.PENDING).length
)

const approvedCount = computed(() =>
  myBookings.value.filter(b => b.status === BOOKING_STATUS.APPROVED).length
)

const rejectedCount = computed(() =>
  myBookings.value.filter(b => b.status === BOOKING_STATUS.REJECTED).length
)

const cancelledCount = computed(() =>
  myBookings.value.filter(b => b.status === BOOKING_STATUS.CANCELLED).length
)

const filteredBookings = computed(() => {
  if (currentFilter.value === 'all') return myBookings.value
  return myBookings.value.filter(b => b.status === currentFilter.value)
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

function showCancelConfirm(booking) {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

function handleCancelBooking() {
  if (!bookingToCancel.value) return

  const result = bookingStore.cancelBooking(bookingToCancel.value.id)
  showCancelModal.value = false
  bookingToCancel.value = null

  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
}
</script>

<style scoped>
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

.filter-item.active i {
  color: var(--color-primary);
}

.booking-meta {
  display: flex;
  gap: 20px;
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

@media (max-width: 768px) {
  .booking-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
