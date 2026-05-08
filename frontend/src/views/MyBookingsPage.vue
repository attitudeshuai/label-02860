<template>
  <div class="my-bookings-page py-5">
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4 animate-fade-in-up">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/"><i class="bi bi-house me-1"></i>首页</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">我的预约</li>
        </ol>
      </nav>

      <div class="d-flex align-items-center justify-content-between mb-4 animate-fade-in-up">
        <h2 class="page-title mb-0">
          <i class="bi bi-calendar2-check me-2 text-primary"></i>我的预约
        </h2>
        <div class="filter-group">
          <button
            v-for="f in filters"
            :key="f.value"
            class="btn btn-sm"
            :class="activeFilter === f.value ? 'btn-primary' : 'btn-outline-secondary'"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
            <span v-if="f.count !== undefined" class="badge bg-white text-primary ms-1">{{ f.count }}</span>
          </button>
        </div>
      </div>

      <div v-if="filteredBookings.length === 0" class="empty-state animate-fade-in-up">
        <i class="bi bi-calendar-x"></i>
        <h5>暂无预约记录</h5>
        <p class="text-muted">去浏览服务并预约吧</p>
        <router-link to="/" class="btn btn-primary mt-3">
          <i class="bi bi-house me-2"></i>返回首页
        </router-link>
      </div>

      <div v-else class="booking-list">
        <div
          v-for="(bk, index) in filteredBookings"
          :key="bk.id"
          class="card booking-card animate-fade-in-up"
          :class="`stagger-${(index % 8) + 1}`"
        >
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="d-flex align-items-center gap-3 mb-2 mb-md-0">
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
              <div class="col-md-3 text-md-center mt-2 mt-md-0">
                <span class="badge status-badge" :class="statusBadgeClass(bk.status)">
                  {{ statusLabel(bk.status) }}
                </span>
              </div>
              <div class="col-md-3 text-md-end mt-2 mt-md-0">
                <div class="booking-actions d-flex justify-content-md-end gap-2">
                  <button
                    v-if="bk.status === 'pending'"
                    class="btn btn-outline-danger btn-sm"
                    @click="handleCancel(bk)"
                  >
                    <i class="bi bi-x-circle me-1"></i>取消预约
                  </button>
                  <router-link
                    v-if="bk.status === 'approved'"
                    :to="`/service/${bk.serviceId}`"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <i class="bi bi-eye me-1"></i>查看服务
                  </router-link>
                  <button
                    v-if="bk.status === 'rejected' && bk.reviewRemark"
                    class="btn btn-outline-secondary btn-sm"
                    @click="showReviewRemark(bk)"
                  >
                    <i class="bi bi-chat-left-text me-1"></i>查看原因
                  </button>
                </div>
              </div>
            </div>
            <div v-if="bk.remark" class="booking-remark mt-2">
              <small class="text-muted"><i class="bi bi-chat-dots me-1"></i>我的备注：{{ bk.remark }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="showCancelConfirm"
      title="取消预约"
      message="确定要取消该预约吗？取消后需重新提交。"
      type="warning"
      confirm-text="确定取消"
      @confirm="confirmCancel"
      @cancel="showCancelConfirm = false"
    />

    <ConfirmDialog
      :visible="showRemarkDialog"
      :title="拒绝原因"
      :message="currentRemark"
      type="info"
      confirm-text="知道了"
      :show-cancel="false"
      @confirm="showRemarkDialog = false"
      @cancel="showRemarkDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const bookingStore = useBookingStore()
const userStore = useUserStore()
const toast = useToastStore()

const activeFilter = ref('all')
const showCancelConfirm = ref(false)
const cancelTargetId = ref(null)
const showRemarkDialog = ref(false)
const currentRemark = ref('')

const myBookings = computed(() => {
  if (!userStore.currentUser) return []
  return bookingStore.getBookingsByUser(userStore.currentUser.id)
})

const filters = computed(() => [
  { value: 'all', label: '全部', count: myBookings.value.length },
  { value: 'pending', label: '待审批', count: myBookings.value.filter(b => b.status === 'pending').length },
  { value: 'approved', label: '已确认', count: myBookings.value.filter(b => b.status === 'approved').length },
  { value: 'rejected', label: '已拒绝', count: myBookings.value.filter(b => b.status === 'rejected').length }
])

const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') return myBookings.value
  return myBookings.value.filter(b => b.status === activeFilter.value)
})

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

function handleCancel(booking) {
  cancelTargetId.value = booking.id
  showCancelConfirm.value = true
}

function confirmCancel() {
  if (cancelTargetId.value) {
    const result = bookingStore.cancelBooking(cancelTargetId.value)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }
  showCancelConfirm.value = false
  cancelTargetId.value = null
}

function showReviewRemark(booking) {
  currentRemark.value = booking.reviewRemark || '未填写原因'
  showRemarkDialog.value = true
}
</script>

<style scoped>
.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-neutral-900);
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.status-badge {
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.booking-remark {
  padding-top: 8px;
  border-top: 1px dashed var(--color-neutral-200);
}

@media (max-width: 768px) {
  .filter-group {
    width: 100%;
  }

  .booking-actions {
    flex-wrap: wrap;
  }
}
</style>
