<template>
  <div class="announcement-page py-5">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header mb-4 animate-fade-in-up">
        <h2 class="page-title">
          <i class="bi bi-megaphone-fill me-2 text-primary"></i>校园公告
        </h2>
        <p class="text-muted">及时了解校园最新动态与通知</p>
      </div>

      <!-- Filters -->
      <div class="filter-bar card mb-4 animate-fade-in-up stagger-1">
        <div class="card-body p-3">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label fw-medium small">公告分类</label>
              <select v-model="filter.category" class="form-select form-select-sm" @change="applyFilter">
                <option value="">全部分类</option>
                <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label fw-medium small">开始日期</label>
              <input
                v-model="filter.startDate"
                type="date"
                class="form-control form-control-sm"
                @change="applyFilter"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label fw-medium small">结束日期</label>
              <input
                v-model="filter.endDate"
                type="date"
                class="form-control form-control-sm"
                @change="applyFilter"
              />
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-secondary btn-sm w-100" @click="resetFilter">
                <i class="bi bi-arrow-counterclockwise me-1"></i>重置筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcement List -->
      <div class="announcement-list">
        <template v-if="paginatedData.data.length > 0">
          <div
            v-for="(ann, index) in paginatedData.data"
            :key="ann.id"
            class="announcement-card card mb-3 animate-fade-in-up"
            :class="[`stagger-${index + 1}`, { 'announcement-top': ann.isTop }]"
          >
            <div class="card-body p-4">
              <div class="d-flex align-items-start">
                <div class="announcement-date-badge me-4 text-center flex-shrink-0 d-none d-md-block">
                  <span class="date-day">{{ getDay(ann.publishTime) }}</span>
                  <span class="date-month">{{ getMonth(ann.publishTime) }}</span>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span v-if="ann.isTop" class="badge-top">
                      <i class="bi bi-pin-angle-fill me-1"></i>置顶
                    </span>
                    <span class="badge-category">{{ ann.category }}</span>
                  </div>
                  <h5 class="announcement-title mb-2">{{ ann.title }}</h5>
                  <p class="announcement-content mb-3">{{ ann.content }}</p>
                  <div class="announcement-footer">
                    <span class="me-3">
                      <i class="bi bi-person me-1"></i>{{ ann.author }}
                    </span>
                    <span>
                      <i class="bi bi-clock me-1"></i>{{ ann.publishTime }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div v-else class="empty-state card">
          <div class="card-body py-5">
            <i class="bi bi-inbox"></i>
            <h5 class="mt-3">暂无公告</h5>
            <p class="text-muted">当前筛选条件下没有匹配的公告</p>
            <button class="btn btn-outline-primary btn-sm mt-2" @click="resetFilter">
              重置筛选条件
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="paginatedData.totalPages > 1" class="mt-4 animate-fade-in-up" aria-label="公告分页">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li
            v-for="page in displayPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === paginatedData.totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
        <div class="text-center text-muted small">
          共 {{ paginatedData.total }} 条公告，第 {{ currentPage }} / {{ paginatedData.totalPages }} 页
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAnnouncementStore } from '@/stores/announcement'

const announcementStore = useAnnouncementStore()

const currentPage = ref(1)
const pageSize = 5

const filter = reactive({
  category: '',
  startDate: '',
  endDate: ''
})

const categoryOptions = computed(() => {
  const cats = new Set(announcementStore.announcements.map(a => a.category))
  return [...cats]
})

const paginatedData = computed(() =>
  announcementStore.getAnnouncements({
    page: currentPage.value,
    pageSize,
    category: filter.category,
    startDate: filter.startDate,
    endDate: filter.endDate
  })
)

const displayPages = computed(() => {
  const total = paginatedData.value.totalPages
  const current = currentPage.value
  const pages = []
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function goToPage(page) {
  if (page < 1 || page > paginatedData.value.totalPages) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function applyFilter() {
  currentPage.value = 1
}

function resetFilter() {
  filter.category = ''
  filter.startDate = ''
  filter.endDate = ''
  currentPage.value = 1
}

function getDay(dateStr) {
  return new Date(dateStr).getDate()
}

function getMonth(dateStr) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return months[new Date(dateStr).getMonth()]
}
</script>

<style scoped>
.page-header {
  padding: 20px 0;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: 4px;
}

.filter-bar {
  border: none;
  border-radius: var(--radius-lg);
}

.announcement-card {
  border: none;
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.announcement-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.announcement-top {
  border-left: 4px solid var(--color-accent);
}

.announcement-date-badge {
  width: 56px;
  padding: 8px;
  background: var(--color-primary-50);
  border-radius: var(--radius-md);
}

.date-day {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.date-month {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
  margin-top: 4px;
}

.announcement-title {
  font-weight: 600;
  color: var(--color-neutral-800);
  font-size: var(--font-size-lg);
}

.announcement-content {
  color: var(--color-neutral-500);
  font-size: var(--font-size-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.7;
}

.announcement-footer {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-400);
}

/* Pagination */
.pagination {
  gap: 4px;
}

.page-link {
  border-radius: var(--radius-md) !important;
  border: 1px solid var(--color-neutral-200);
  color: var(--color-neutral-600);
  padding: 8px 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.page-link:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.page-item.active .page-link {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.page-item.disabled .page-link {
  color: var(--color-neutral-300);
}
</style>
