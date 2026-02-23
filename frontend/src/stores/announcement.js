/**
 * 公告状态管理
 *
 * 管理公告列表，支持分页、时间范围、分类筛选，置顶优先排序。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAnnouncements } from '@/data/mock'

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcements = ref([...mockAnnouncements])

  /** 置顶公告列表 */
  const topAnnouncements = computed(() =>
    announcements.value.filter(a => a.isTop)
  )

  /** 最新 5 条公告（按发布时间倒序） */
  const latestAnnouncements = computed(() =>
    [...announcements.value]
      .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
      .slice(0, 5)
  )

  /**
   * 分页查询公告，支持分类、时间范围筛选
   * @returns {{ data: [], total: number, totalPages: number, currentPage: number }}
   */
  function getAnnouncements({ page = 1, pageSize = 5, startDate = '', endDate = '', category = '' } = {}) {
    let filtered = [...announcements.value]

    if (category && category !== '全部') {
      filtered = filtered.filter(a => a.category === category)
    }

    if (startDate) {
      filtered = filtered.filter(a => a.publishTime >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter(a => a.publishTime <= endDate)
    }

    filtered.sort((a, b) => {
      if (a.isTop && !b.isTop) return -1
      if (!a.isTop && b.isTop) return 1
      return new Date(b.publishTime) - new Date(a.publishTime)
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    return { data, total, totalPages, currentPage: page }
  }

  function getAnnouncementById(id) {
    return announcements.value.find(a => a.id === Number(id)) || null
  }

  return {
    announcements,
    topAnnouncements,
    latestAnnouncements,
    getAnnouncements,
    getAnnouncementById
  }
})
