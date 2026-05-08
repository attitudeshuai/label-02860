<template>
  <div class="service-detail-page py-5">
    <div class="container">
      <!-- Loading state -->
      <div v-if="!service" class="empty-state">
        <i class="bi bi-exclamation-circle"></i>
        <h5>服务未找到</h5>
        <p class="text-muted">请检查链接是否正确</p>
        <router-link to="/" class="btn btn-primary mt-3">
          <i class="bi bi-house me-2"></i>返回首页
        </router-link>
      </div>

      <template v-else>
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4 animate-fade-in-up">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/"><i class="bi bi-house me-1"></i>首页</router-link>
            </li>
            <li class="breadcrumb-item">
              <span>{{ service.category }}</span>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ service.title }}</li>
          </ol>
        </nav>

        <div class="row g-4">
          <!-- Main Content -->
          <div class="col-lg-8">
            <!-- Hero Image -->
            <div class="detail-hero animate-fade-in-up">
              <img :src="service.image" :alt="service.title" class="detail-image" />
              <div class="detail-rating">
                <i class="bi bi-star-fill me-1"></i>
                <span>{{ service.rating }}</span>
              </div>
            </div>

            <!-- Service Info -->
            <div class="card mt-4 animate-fade-in-up stagger-1">
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <span class="badge-category me-3">{{ service.category }}</span>
                  <div class="rating-stars">
                    <i
                      v-for="n in 5"
                      :key="n"
                      :class="n <= Math.round(service.rating) ? 'bi bi-star-fill' : 'bi bi-star'"
                    ></i>
                    <span class="ms-2 text-muted" style="font-size: 14px;">
                      {{ service.rating }} 分
                    </span>
                  </div>
                </div>

                <h2 class="detail-title mb-3">{{ service.title }}</h2>
                <p class="detail-description">{{ service.detail }}</p>
              </div>
            </div>

            <!-- Booking Form -->
            <div class="card mt-4 animate-fade-in-up stagger-2">
              <div class="card-body p-4">
                <h5 class="card-title mb-3">
                  <i class="bi bi-calendar-check me-2 text-primary"></i>在线预约
                </h5>

                <template v-if="!userStore.isLoggedIn">
                  <div class="booking-login-hint">
                    <i class="bi bi-lock me-2"></i>
                    <span>请先</span>
                    <router-link :to="{ name: 'login', query: { redirect: $route.fullPath } }" class="fw-bold">
                      登录
                    </router-link>
                    <span>后进行预约</span>
                  </div>
                </template>

                <template v-else>
                  <form @submit.prevent="handleSubmitBooking" novalidate>
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label fw-medium">预约日期</label>
                        <input
                          v-model="bookingForm.date"
                          type="date"
                          class="form-control"
                          :class="{ 'is-invalid': formErrors.date }"
                          :min="minDate"
                          @blur="validateField('date')"
                          @input="formErrors.date = ''"
                          @change="onDateChange"
                        />
                        <div v-if="formErrors.date" class="invalid-feedback">
                          {{ formErrors.date }}
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-medium">预约时段</label>
                        <select
                          v-model="bookingForm.timeSlot"
                          class="form-select"
                          :class="{ 'is-invalid': formErrors.timeSlot }"
                          @blur="validateField('timeSlot')"
                          @change="formErrors.timeSlot = ''"
                        >
                          <option value="">请选择时段</option>
                          <option
                            v-for="slot in timeSlots"
                            :key="slot.value"
                            :value="slot.value"
                            :disabled="isSlotBooked(slot.value)"
                          >
                            {{ slot.label }}{{ isSlotBooked(slot.value) ? '（已约满）' : '' }}
                          </option>
                        </select>
                        <div v-if="formErrors.timeSlot" class="invalid-feedback">
                          {{ formErrors.timeSlot }}
                        </div>
                      </div>
                      <div class="col-12">
                        <label class="form-label fw-medium">备注（选填）</label>
                        <textarea
                          v-model="bookingForm.remark"
                          class="form-control"
                          rows="3"
                          placeholder="如有特殊需求请在此说明"
                          maxlength="200"
                        ></textarea>
                        <small class="text-muted">{{ bookingForm.remark.length }}/200</small>
                      </div>
                      <div class="col-12 mt-3">
                        <button
                          type="submit"
                          class="btn btn-primary px-4"
                          :disabled="submitting"
                        >
                          <span v-if="submitting" class="loading-spinner me-2"></span>
                          <i v-else class="bi bi-check2-circle me-1"></i>
                          {{ submitting ? '提交中...' : '提交预约' }}
                        </button>
                      </div>
                    </div>
                  </form>
                </template>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Quick Info -->
            <div class="card animate-fade-in-up stagger-2">
              <div class="card-body p-4">
                <h5 class="card-title mb-4">
                  <i class="bi bi-info-circle me-2 text-primary"></i>服务信息
                </h5>
                <ul class="info-list">
                  <li>
                    <div class="info-icon">
                      <i class="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <small class="text-muted">服务地点</small>
                      <p class="mb-0 fw-medium">{{ service.location }}</p>
                    </div>
                  </li>
                  <li>
                    <div class="info-icon">
                      <i class="bi bi-clock-fill"></i>
                    </div>
                    <div>
                      <small class="text-muted">开放时间</small>
                      <p class="mb-0 fw-medium">{{ service.openTime }}</p>
                    </div>
                  </li>
                  <li>
                    <div class="info-icon">
                      <i class="bi bi-telephone-fill"></i>
                    </div>
                    <div>
                      <small class="text-muted">联系方式</small>
                      <p class="mb-0 fw-medium">{{ service.contact }}</p>
                    </div>
                  </li>
                  <li>
                    <div class="info-icon">
                      <i class="bi bi-calendar-check-fill"></i>
                    </div>
                    <div>
                      <small class="text-muted">预约方式</small>
                      <p class="mb-0 fw-medium">{{ service.bookingMethod }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- My bookings for this service -->
            <div v-if="userStore.isLoggedIn && myServiceBookings.length" class="card mt-4 animate-fade-in-up stagger-3">
              <div class="card-body p-4">
                <h5 class="card-title mb-3">
                  <i class="bi bi-list-check me-2 text-primary"></i>我的预约
                </h5>
                <div class="my-booking-list">
                  <div
                    v-for="bk in myServiceBookings"
                    :key="bk.id"
                    class="my-booking-item"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="fw-medium">{{ bk.date }}</div>
                        <small class="text-muted">{{ bk.timeSlot }}</small>
                      </div>
                      <span class="badge" :class="statusBadgeClass(bk.status)">
                        {{ statusLabel(bk.status) }}
                      </span>
                    </div>
                  </div>
                </div>
                <router-link to="/my-bookings" class="btn btn-outline-primary btn-sm w-100 mt-3">
                  查看全部预约 <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>

            <!-- Related Services -->
            <div class="card mt-4 animate-fade-in-up stagger-3">
              <div class="card-body p-4">
                <h5 class="card-title mb-3">
                  <i class="bi bi-grid me-2 text-primary"></i>相关服务
                </h5>
                <div class="related-list">
                  <router-link
                    v-for="rel in relatedServices"
                    :key="rel.id"
                    :to="`/service/${rel.id}`"
                    class="related-item"
                  >
                    <img :src="rel.image" :alt="rel.title" class="related-thumb" loading="lazy" />
                    <div class="related-info">
                      <h6 class="mb-0">{{ rel.title }}</h6>
                      <small class="text-muted">{{ rel.location }}</small>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useServiceStore } from '@/stores/service'
import { useBookingStore } from '@/stores/booking'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const serviceStore = useServiceStore()
const bookingStore = useBookingStore()
const userStore = useUserStore()
const toast = useToastStore()

const service = computed(() =>
  serviceStore.getServiceById(route.params.id)
)

const relatedServices = computed(() => {
  if (!service.value) return []
  return serviceStore.services
    .filter(s => s.category === service.value.category && s.id !== service.value.id)
    .slice(0, 3)
})

const myServiceBookings = computed(() => {
  if (!userStore.currentUser) return []
  return bookingStore.getBookingsByService(route.params.id)
    .filter(b => b.userId === userStore.currentUser.id)
    .slice(0, 3)
})

const timeSlots = [
  { value: '08:00 - 09:00', label: '08:00 - 09:00' },
  { value: '09:00 - 10:00', label: '09:00 - 10:00' },
  { value: '10:00 - 11:00', label: '10:00 - 11:00' },
  { value: '11:00 - 12:00', label: '11:00 - 12:00' },
  { value: '14:00 - 15:00', label: '14:00 - 15:00' },
  { value: '15:00 - 16:00', label: '15:00 - 16:00' },
  { value: '16:00 - 17:00', label: '16:00 - 17:00' },
  { value: '19:00 - 20:00', label: '19:00 - 20:00' }
]

const minDate = computed(() => {
  const d = new Date()
  return d.toISOString().split('T')[0]
})

const bookingForm = reactive({
  date: '',
  timeSlot: '',
  remark: ''
})

const formErrors = reactive({
  date: '',
  timeSlot: ''
})

const submitting = ref(false)

function isSlotBooked(slotValue) {
  if (!bookingForm.date) return false
  return bookingStore.bookings.some(
    b =>
      b.serviceId === Number(route.params.id) &&
      b.date === bookingForm.date &&
      b.timeSlot === slotValue &&
      b.status !== 'rejected' &&
      b.status !== 'cancelled'
  )
}

function onDateChange(e) {
  bookingForm.date = e.target.value
  formErrors.date = ''
}

function validateField(field) {
  if (field === 'date') {
    formErrors.date = bookingForm.date ? '' : '请选择预约日期'
  }
  if (field === 'timeSlot') {
    formErrors.timeSlot = bookingForm.timeSlot ? '' : '请选择预约时段'
  }
}

function validateForm() {
  validateField('date')
  validateField('timeSlot')
  return !formErrors.date && !formErrors.timeSlot
}

async function handleSubmitBooking() {
  if (!validateForm()) return

  submitting.value = true
  await new Promise(r => setTimeout(r, 500))

  const result = bookingStore.createBooking({
    userId: userStore.currentUser.id,
    serviceId: route.params.id,
    serviceTitle: service.value.title,
    date: bookingForm.date,
    timeSlot: bookingForm.timeSlot,
    remark: bookingForm.remark
  })

  submitting.value = false

  if (result.success) {
    toast.success(result.message)
    bookingForm.date = ''
    bookingForm.timeSlot = ''
    bookingForm.remark = ''
  } else {
    toast.error(result.message)
  }
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
</script>

<style scoped>
.detail-hero {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.detail-image {
  width: 100%;
  height: 360px;
  object-fit: cover;
}

.detail-rating {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.65);
  color: var(--color-accent);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--font-size-sm);
  backdrop-filter: blur(4px);
}

.detail-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-neutral-900);
}

.detail-description {
  color: var(--color-neutral-600);
  line-height: 1.8;
  font-size: var(--font-size-base);
}

.booking-login-hint {
  padding: 24px;
  background: var(--color-primary-50);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);
  text-align: center;
  color: var(--color-neutral-700);
  font-size: var(--font-size-base);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-neutral-100);
}

.info-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.my-booking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.my-booking-item {
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: var(--color-neutral-50);
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 8px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.related-item:hover {
  background: var(--color-neutral-50);
}

.related-thumb {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  object-fit: cover;
  flex-shrink: 0;
}

.related-info h6 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-neutral-800);
}

@media (max-width: 768px) {
  .detail-image {
    height: 240px;
  }
}
</style>
