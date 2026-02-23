/**
 * 校园服务状态管理
 *
 * 管理服务列表、分类及热门服务，数据来源于 mock。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockServices, serviceCategories } from '@/data/mock'

export const useServiceStore = defineStore('service', () => {
  const services = ref([...mockServices])
  const categories = ref([...serviceCategories])

  /** 按评分排序取前 4 条热门服务 */
  const hotServices = computed(() =>
    [...services.value].sort((a, b) => b.rating - a.rating).slice(0, 4)
  )

  /** 根据 ID 获取单个服务 */
  function getServiceById(id) {
    return services.value.find(s => s.id === Number(id)) || null
  }

  /** 按分类筛选服务，'全部' 返回所有 */
  function getServicesByCategory(categoryName) {
    if (!categoryName || categoryName === '全部') {
      return services.value
    }
    return services.value.filter(s => s.category === categoryName)
  }

  return {
    services,
    categories,
    hotServices,
    getServiceById,
    getServicesByCategory
  }
})
