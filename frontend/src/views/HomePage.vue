<template>
  <div class="home-page">
    <!-- Hero Banner -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&h=500&fit=crop"
          alt="校园风景"
          class="hero-image"
        />
      </div>
      <div class="container hero-content">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <h1 class="hero-title animate-fade-in-up">
              校园生活服务平台
            </h1>
            <p class="hero-subtitle animate-fade-in-up stagger-1">
              一站式校园服务，让大学生活更便捷、更精彩
            </p>
            <div class="hero-actions animate-fade-in-up stagger-2">
              <router-link to="/announcements" class="btn btn-light btn-lg me-3">
                <i class="bi bi-megaphone me-2"></i>查看公告
              </router-link>
              <router-link v-if="!userStore.isLoggedIn" :to="{ name: 'login', query: { tab: 'register' } }" class="btn btn-outline-light btn-lg">
                <i class="bi bi-person-plus me-2"></i>立即注册
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Announcements -->
    <section class="section-announcements py-5">
      <div class="container">
        <h2 class="section-title animate-fade-in-up">
          <i class="bi bi-megaphone-fill me-2 text-primary"></i>校园公告
        </h2>
        <div class="row g-3">
          <div
            v-for="(ann, index) in latestAnnouncements"
            :key="ann.id"
            class="col-12 animate-fade-in-up"
            :class="`stagger-${index + 1}`"
          >
            <div class="announcement-item card-hover" @click="goToAnnouncements">
              <div class="d-flex align-items-start">
                <span v-if="ann.isTop" class="badge-top me-3 flex-shrink-0">置顶</span>
                <span v-else class="badge-category me-3 flex-shrink-0">{{ ann.category }}</span>
                <div class="flex-grow-1 min-width-0">
                  <h6 class="announcement-title mb-1">{{ ann.title }}</h6>
                  <div class="announcement-meta">
                    <span><i class="bi bi-person me-1"></i>{{ ann.author }}</span>
                    <span><i class="bi bi-clock me-1"></i>{{ ann.publishTime }}</span>
                  </div>
                </div>
                <i class="bi bi-chevron-right text-muted ms-2 flex-shrink-0"></i>
              </div>
            </div>
          </div>
          <div class="col-12 text-center mt-3">
            <router-link to="/announcements" class="btn btn-outline-primary">
              查看全部公告 <i class="bi bi-arrow-right ms-1"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Categories -->
    <section class="section-categories py-5">
      <div class="container">
        <h2 class="section-title animate-fade-in-up">
          <i class="bi bi-grid-fill me-2 text-primary"></i>热门服务分类
        </h2>
        <div class="row g-4">
          <div
            v-for="(cat, index) in categories"
            :key="cat.id"
            class="col-6 col-md-4 col-lg animate-fade-in-up"
            :class="`stagger-${index + 1}`"
          >
            <div class="category-card card-hover text-center p-4" @click="scrollToServices(cat.name)">
              <div class="category-icon" :style="{ background: cat.color + '15', color: cat.color }">
                <i :class="cat.icon"></i>
              </div>
              <h6 class="category-name mt-3 mb-0">{{ cat.name }}</h6>
              <small class="text-muted">
                {{ serviceStore.getServicesByCategory(cat.name).length }} 项服务
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hot Services -->
    <section class="section-services py-5" id="services">
      <div class="container">
        <h2 class="section-title animate-fade-in-up">
          <i class="bi bi-star-fill me-2 text-warning"></i>热门服务
        </h2>
        <div class="row g-4">
          <div
            v-for="(svc, index) in serviceStore.hotServices"
            :key="svc.id"
            class="col-md-6 col-lg-3 animate-fade-in-up"
            :class="`stagger-${index + 1}`"
          >
            <router-link :to="`/service/${svc.id}`" class="text-decoration-none">
              <div class="card service-card card-hover h-100">
                <div class="service-img-wrap">
                  <img :src="svc.image" :alt="svc.title" class="card-img-top" loading="lazy" />
                  <span class="service-rating">
                    <i class="bi bi-star-fill me-1"></i>{{ svc.rating }}
                  </span>
                </div>
                <div class="card-body">
                  <span class="badge-category mb-2 d-inline-block">{{ svc.category }}</span>
                  <h6 class="card-title service-title">{{ svc.title }}</h6>
                  <p class="card-text service-desc">{{ svc.description }}</p>
                  <div class="service-location">
                    <i class="bi bi-geo-alt me-1"></i>
                    <small>{{ svc.location }}</small>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Campus Map Entry -->
    <section class="section-map py-5">
      <div class="container">
        <div class="map-card">
          <div class="row align-items-center g-0">
            <div class="col-lg-6 p-5">
              <h2 class="mb-3 animate-fade-in-up">
                <i class="bi bi-map me-2 text-primary"></i>校园地图
              </h2>
              <p class="text-muted mb-4 animate-fade-in-up stagger-1">
                快速定位校园内的服务设施、教学楼、食堂、图书馆等位置，让你不再迷路。
              </p>
              <div class="d-flex gap-3 animate-fade-in-up stagger-2">
                <div class="map-stat">
                  <strong class="text-primary">20+</strong>
                  <small class="text-muted d-block">服务点位</small>
                </div>
                <div class="map-stat">
                  <strong class="text-primary">5</strong>
                  <small class="text-muted d-block">大食堂</small>
                </div>
                <div class="map-stat">
                  <strong class="text-primary">3</strong>
                  <small class="text-muted d-block">图书馆</small>
                </div>
                <div class="map-stat">
                  <strong class="text-primary">15</strong>
                  <small class="text-muted d-block">打印点</small>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="map-preview">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?w=700&h=400&fit=crop"
                  alt="校园鸟瞰"
                  class="map-image"
                  loading="lazy"
                />
                <div class="map-overlay-btn" @click="onMapClick">
                  <i class="bi bi-fullscreen me-2"></i>查看完整地图
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useServiceStore } from '@/stores/service'
import { useAnnouncementStore } from '@/stores/announcement'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'

const serviceStore = useServiceStore()
const announcementStore = useAnnouncementStore()
const userStore = useUserStore()
const toastStore = useToastStore()
const router = useRouter()

const categories = serviceStore.categories
const latestAnnouncements = announcementStore.latestAnnouncements

function goToAnnouncements() {
  router.push('/announcements')
}

function scrollToServices() {
  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
}

function onMapClick() {
  router.push({ name: 'campus-map' })
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.88) 0%, rgba(37, 99, 235, 0.7) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 60px 0;
}

.hero-title {
  color: white;
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--font-size-xl);
  margin-bottom: 28px;
}

.hero-actions .btn-lg {
  padding: 10px 28px;
  font-weight: 600;
  border-radius: var(--radius-lg);
}

/* Announcements */
.announcement-item {
  padding: 16px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.announcement-item:hover {
  box-shadow: var(--shadow-md);
}

.announcement-title {
  font-weight: 600;
  color: var(--color-neutral-800);
  font-size: var(--font-size-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.announcement-meta {
  display: flex;
  gap: 16px;
  font-size: var(--font-size-xs);
  color: var(--color-neutral-400);
}

.min-width-0 {
  min-width: 0;
}

/* Categories */
.section-categories {
  background: white;
}

.category-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.category-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto;
  transition: transform var(--transition-normal);
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-name {
  font-weight: 600;
  color: var(--color-neutral-800);
}

/* Services */
.service-card {
  border: none;
  overflow: hidden;
}

.service-img-wrap {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.service-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.service-card:hover .service-img-wrap img {
  transform: scale(1.06);
}

.service-rating {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: var(--color-accent);
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.service-title {
  font-weight: 600;
  color: var(--color-neutral-800);
  margin-bottom: 8px;
}

.service-desc {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.service-location {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-400);
}

/* Map Section */
.map-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.map-stat {
  text-align: center;
}

.map-stat strong {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.map-preview {
  position: relative;
  height: 100%;
  min-height: 300px;
  overflow: hidden;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-overlay-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-primary);
  padding: 10px 24px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.map-overlay-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .hero-section {
    min-height: 320px;
  }
}
</style>
