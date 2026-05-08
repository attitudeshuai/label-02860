<template>
  <div class="profile-page py-5">
    <div class="container">
      <div class="row g-4">
        <!-- Profile Sidebar -->
        <div class="col-lg-4">
          <div class="card profile-card animate-fade-in-up">
            <div class="profile-cover"></div>
            <div class="card-body text-center profile-info">
              <div class="profile-avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <h4 class="mt-3 fw-bold">{{ userStore.currentUser?.nickname }}</h4>
              <p class="text-muted mb-3">
                <span class="badge bg-primary bg-opacity-10 text-primary">
                  {{ userStore.currentUser?.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </p>
              <div class="profile-stats d-flex justify-content-center gap-4">
                <div class="stat-item">
                  <strong class="d-block text-primary">{{ myBookingCount }}</strong>
                  <small class="text-muted">已预约</small>
                </div>
                <div class="stat-item">
                  <strong class="d-block text-primary">{{ pendingCount }}</strong>
                  <small class="text-muted">待审批</small>
                </div>
                <div class="stat-item">
                  <strong class="d-block text-primary">{{ approvedCount }}</strong>
                  <small class="text-muted">已确认</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mt-4 animate-fade-in-up stagger-1">
            <div class="card-body p-3">
              <router-link to="/my-bookings" class="quick-action text-decoration-none">
                <i class="bi bi-calendar2-check text-primary"></i>
                <span>我的预约</span>
                <span v-if="pendingCount > 0" class="badge bg-warning bg-opacity-10 text-warning ms-1">{{ pendingCount }}</span>
                <i class="bi bi-chevron-right ms-auto text-muted"></i>
              </router-link>
              <router-link v-if="userStore.userRole === 'admin'" to="/admin/bookings" class="quick-action text-decoration-none">
                <i class="bi bi-clipboard-check text-success"></i>
                <span>预约审批</span>
                <i class="bi bi-chevron-right ms-auto text-muted"></i>
              </router-link>
              <div class="quick-action" @click="activeTab = 'profile'">
                <i class="bi bi-person-gear text-primary"></i>
                <span>编辑资料</span>
                <i class="bi bi-chevron-right ms-auto text-muted"></i>
              </div>
              <div class="quick-action" @click="activeTab = 'security'">
                <i class="bi bi-shield-lock text-warning"></i>
                <span>账号安全</span>
                <i class="bi bi-chevron-right ms-auto text-muted"></i>
              </div>
              <div class="quick-action text-danger" @click="showLogoutConfirm = true">
                <i class="bi bi-box-arrow-right"></i>
                <span>退出登录</span>
                <i class="bi bi-chevron-right ms-auto"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-lg-8">
          <!-- Edit Profile Tab -->
          <div v-if="activeTab === 'profile'" class="card animate-fade-in-up stagger-2">
            <div class="card-body p-4">
              <h5 class="card-title mb-4">
                <i class="bi bi-person-gear me-2 text-primary"></i>编辑个人资料
              </h5>
              <form @submit.prevent="handleSaveProfile" novalidate>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-medium">用户名</label>
                    <input
                      :value="userStore.currentUser?.username"
                      type="text"
                      class="form-control"
                      disabled
                    />
                    <small class="text-muted">用户名不可修改</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">昵称</label>
                    <input
                      v-model="profileForm.nickname"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': profileErrors.nickname }"
                      placeholder="输入您的昵称"
                      @blur="validateProfileField('nickname')"
                      @input="profileErrors.nickname = ''"
                    />
                    <div v-if="profileErrors.nickname" class="invalid-feedback">
                      {{ profileErrors.nickname }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">邮箱</label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': profileErrors.email }"
                      placeholder="输入您的邮箱"
                      @blur="validateProfileField('email')"
                      @input="profileErrors.email = ''"
                    />
                    <div v-if="profileErrors.email" class="invalid-feedback">
                      {{ profileErrors.email }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">手机号</label>
                    <input
                      v-model="profileForm.phone"
                      type="tel"
                      class="form-control"
                      :class="{ 'is-invalid': profileErrors.phone }"
                      placeholder="输入您的手机号"
                      @blur="validateProfileField('phone')"
                      @input="profileErrors.phone = ''"
                    />
                    <div v-if="profileErrors.phone" class="invalid-feedback">
                      {{ profileErrors.phone }}
                    </div>
                  </div>
                  <div class="col-12 mt-4">
                    <button
                      type="submit"
                      class="btn btn-primary px-4"
                      :disabled="saving"
                    >
                      <span v-if="saving" class="loading-spinner me-2"></span>
                      {{ saving ? '保存中...' : '保存修改' }}
                    </button>
                    <button type="button" class="btn btn-outline-secondary ms-3" @click="resetProfileForm">
                      重置
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="card animate-fade-in-up stagger-2">
            <div class="card-body p-4">
              <h5 class="card-title mb-4">
                <i class="bi bi-shield-lock me-2 text-warning"></i>账号安全
              </h5>
              <div class="security-items">
                <div class="security-item d-flex align-items-center justify-content-between p-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="security-icon bg-success bg-opacity-10 text-success">
                      <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <div>
                      <h6 class="mb-0">登录密码</h6>
                      <small class="text-muted">定期修改密码可以保护账号安全</small>
                    </div>
                  </div>
                  <span class="badge bg-success bg-opacity-10 text-success">已设置</span>
                </div>
                <div class="security-item d-flex align-items-center justify-content-between p-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="security-icon" :class="profileForm.email ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'">
                      <i :class="profileForm.email ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'"></i>
                    </div>
                    <div>
                      <h6 class="mb-0">邮箱绑定</h6>
                      <small class="text-muted">{{ profileForm.email || '未绑定邮箱' }}</small>
                    </div>
                  </div>
                  <span
                    class="badge"
                    :class="profileForm.email ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'"
                  >
                    {{ profileForm.email ? '已绑定' : '未绑定' }}
                  </span>
                </div>
                <div class="security-item d-flex align-items-center justify-content-between p-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="security-icon" :class="profileForm.phone ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'">
                      <i :class="profileForm.phone ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'"></i>
                    </div>
                    <div>
                      <h6 class="mb-0">手机绑定</h6>
                      <small class="text-muted">{{ profileForm.phone || '未绑定手机号' }}</small>
                    </div>
                  </div>
                  <span
                    class="badge"
                    :class="profileForm.phone ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'"
                  >
                    {{ profileForm.phone ? '已绑定' : '未绑定' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :visible="showLogoutConfirm"
      title="退出登录"
      message="确定要退出当前账号吗？"
      type="warning"
      confirm-text="退出"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useBookingStore } from '@/stores/booking'
import { useToastStore } from '@/stores/toast'
import { validateNickname, validateEmail, validatePhone } from '@/utils/validators'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const router = useRouter()
const userStore = useUserStore()
const bookingStore = useBookingStore()
const toast = useToastStore()

const myBookings = computed(() => {
  if (!userStore.currentUser) return []
  return bookingStore.getBookingsByUser(userStore.currentUser.id)
})

const myBookingCount = computed(() => myBookings.value.length)
const pendingCount = computed(() => myBookings.value.filter(b => b.status === 'pending').length)
const approvedCount = computed(() => myBookings.value.filter(b => b.status === 'approved').length)

const activeTab = ref('profile')
const saving = ref(false)
const showLogoutConfirm = ref(false)

const profileForm = reactive({
  nickname: '',
  email: '',
  phone: ''
})

const profileErrors = reactive({
  nickname: '',
  email: '',
  phone: ''
})

function resetProfileForm() {
  const user = userStore.currentUser
  if (user) {
    profileForm.nickname = user.nickname || ''
    profileForm.email = user.email || ''
    profileForm.phone = user.phone || ''
  }
  Object.keys(profileErrors).forEach(k => profileErrors[k] = '')
}

onMounted(() => {
  resetProfileForm()
})

function validateProfileField(field) {
  if (field === 'nickname') {
    profileErrors.nickname = validateNickname(profileForm.nickname)
  }
  if (field === 'email') {
    profileErrors.email = validateEmail(profileForm.email)
  }
  if (field === 'phone') {
    profileErrors.phone = validatePhone(profileForm.phone)
  }
}

function validateProfileForm() {
  validateProfileField('nickname')
  validateProfileField('email')
  validateProfileField('phone')
  return !profileErrors.nickname && !profileErrors.email && !profileErrors.phone
}

async function handleSaveProfile() {
  if (!validateProfileForm()) return

  saving.value = true
  await new Promise(r => setTimeout(r, 500))

  const result = userStore.updateProfile({
    nickname: profileForm.nickname,
    email: profileForm.email,
    phone: profileForm.phone
  })

  saving.value = false

  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
}

function handleLogout() {
  showLogoutConfirm.value = false
  userStore.logout()
  toast.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.profile-card {
  border: none;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.profile-cover {
  height: 100px;
  background: linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #059669 100%);
}

.profile-info {
  margin-top: -40px;
  position: relative;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 4px solid white;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 36px;
  color: var(--color-primary);
}

.profile-stats {
  padding-top: 16px;
  border-top: 1px solid var(--color-neutral-100);
}

.stat-item strong {
  font-size: var(--font-size-xl);
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
  font-weight: 500;
}

.quick-action:hover {
  background: var(--color-neutral-50);
}

.quick-action i:first-child {
  font-size: 20px;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.security-item {
  border-radius: var(--radius-md);
  background: var(--color-neutral-50);
}

.security-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>
