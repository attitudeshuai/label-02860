<template>
  <div class="campus-map-page">
    <div class="map-header">
      <div class="container d-flex align-items-center justify-content-between py-3">
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-primary btn-sm me-3" @click="goBack">
            <i class="bi bi-arrow-left me-1"></i>返回
          </button>
          <h4 class="mb-0">
            <i class="bi bi-map me-2 text-primary"></i>校园地图
          </h4>
        </div>
        <div class="map-controls">
          <button class="btn btn-outline-secondary btn-sm me-2" @click="zoomIn" title="放大">
            <i class="bi bi-zoom-in"></i>
          </button>
          <button class="btn btn-outline-secondary btn-sm me-2" @click="zoomOut" title="缩小">
            <i class="bi bi-zoom-out"></i>
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="resetZoom" title="重置">
            <i class="bi bi-arrows-fullscreen"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="map-container" ref="mapContainerRef">
      <div
        class="map-wrapper"
        :style="mapStyle"
        @mousedown="startDrag"
        @touchstart.passive="startDrag"
      >
        <img
          :src="campusMapImg"
          alt="校园地图"
          class="map-image"
          draggable="false"
          @load="onImageLoad"
        />
      </div>
    </div>

    <div class="map-footer">
      <div class="container d-flex align-items-center justify-content-between py-2">
        <small class="text-muted">
          <i class="bi bi-info-circle me-1"></i>拖拽移动地图，使用按钮或滚轮缩放
        </small>
        <small class="text-muted">
          缩放: {{ Math.round(scale * 100) }}%
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import campusMapImg from '@/assets/campus-map.jpg'

const router = useRouter()
const mapContainerRef = ref(null)

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let dragStartTranslateX = 0
let dragStartTranslateY = 0

const mapStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  cursor: isDragging.value ? 'grabbing' : 'grab'
}))

function goBack() {
  router.back()
}

function zoomIn() {
  scale.value = Math.min(scale.value + 0.25, 4)
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.25, 0.5)
}

function resetZoom() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

function onImageLoad() {
  resetZoom()
}

function startDrag(e) {
  isDragging.value = true
  const point = e.touches ? e.touches[0] : e
  dragStartX = point.clientX
  dragStartY = point.clientY
  dragStartTranslateX = translateX.value
  dragStartTranslateY = translateY.value
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag, { passive: true })
  document.addEventListener('touchend', stopDrag)
}

function onDrag(e) {
  if (!isDragging.value) return
  const point = e.touches ? e.touches[0] : e
  translateX.value = dragStartTranslateX + (point.clientX - dragStartX)
  translateY.value = dragStartTranslateY + (point.clientY - dragStartY)
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

function onWheel(e) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  scale.value = Math.min(Math.max(scale.value + delta, 0.5), 4)
}

onMounted(() => {
  mapContainerRef.value?.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  mapContainerRef.value?.removeEventListener('wheel', onWheel)
  stopDrag()
})
</script>

<style scoped>
.campus-map-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-neutral-100, #f5f5f5);
}

.map-header {
  background: var(--bg-card, #fff);
  border-bottom: 1px solid var(--color-neutral-200, #e5e5e5);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
  z-index: 10;
}

.map-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-wrapper {
  transform-origin: center center;
  transition: none;
  user-select: none;
  -webkit-user-select: none;
}

.map-image {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-lg, 0 4px 20px rgba(0,0,0,0.15));
}

.map-footer {
  background: var(--bg-card, #fff);
  border-top: 1px solid var(--color-neutral-200, #e5e5e5);
  z-index: 10;
}

.map-controls .btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
</style>
