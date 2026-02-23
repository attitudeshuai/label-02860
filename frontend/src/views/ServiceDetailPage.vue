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

            <!-- Booking Info -->
            <div class="card mt-4 animate-fade-in-up stagger-2">
              <div class="card-body p-4">
                <h5 class="card-title mb-3">
                  <i class="bi bi-calendar-check me-2 text-primary"></i>预约方式
                </h5>
                <div class="booking-info">
                  <p>{{ service.bookingMethod }}</p>
                </div>
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
                </ul>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useServiceStore } from '@/stores/service'

const route = useRoute()
const serviceStore = useServiceStore()

const service = computed(() =>
  serviceStore.getServiceById(route.params.id)
)

const relatedServices = computed(() => {
  if (!service.value) return []
  return serviceStore.services
    .filter(s => s.category === service.value.category && s.id !== service.value.id)
    .slice(0, 3)
})
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

.booking-info {
  padding: 16px;
  background: var(--color-primary-50);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);
}

.booking-info p {
  margin: 0;
  color: var(--color-neutral-700);
  line-height: 1.7;
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
