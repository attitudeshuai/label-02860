import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/utils/storage'
import { mockBookings } from '@/data/mock'

export const useBookingStore = defineStore('booking', () => {
  const BOOKING_DATA_VERSION = 2
  const storedVersion = loadFromStorage(STORAGE_KEYS.BOOKING_VERSION, 0)
  const stored = loadFromStorage(STORAGE_KEYS.BOOKINGS, null)
  const bookings = ref(
    storedVersion < BOOKING_DATA_VERSION || !stored || stored.length === 0
      ? [...mockBookings]
      : stored
  )
  if (storedVersion < BOOKING_DATA_VERSION) {
    saveToStorage(STORAGE_KEYS.BOOKING_VERSION, BOOKING_DATA_VERSION)
    persist()
  }

  function persist() {
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings.value)
  }

  const pendingBookings = computed(() =>
    bookings.value.filter(b => b.status === 'pending')
  )

  function getBookingsByUser(userId) {
    return bookings.value
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  function getBookingsByService(serviceId) {
    return bookings.value.filter(b => b.serviceId === Number(serviceId))
  }

  function createBooking({ userId, serviceId, serviceTitle, date, timeSlot, remark }) {
    const conflict = bookings.value.some(
      b =>
        b.serviceId === Number(serviceId) &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status !== 'rejected' &&
        b.status !== 'cancelled'
    )
    if (conflict) {
      return { success: false, message: '该时间段已被预约，请选择其他时间' }
    }

    const booking = {
      id: Date.now(),
      userId,
      serviceId: Number(serviceId),
      serviceTitle,
      date,
      timeSlot,
      remark: remark || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewRemark: ''
    }

    bookings.value.push(booking)
    persist()

    return { success: true, message: '预约提交成功，请等待管理员审批', booking }
  }

  function approveBooking(bookingId, reviewRemark = '') {
    const booking = bookings.value.find(b => b.id === bookingId)
    if (!booking) {
      return { success: false, message: '预约不存在' }
    }
    if (booking.status !== 'pending') {
      return { success: false, message: '该预约已处理' }
    }

    booking.status = 'approved'
    booking.reviewedAt = new Date().toISOString()
    booking.reviewRemark = reviewRemark
    persist()

    return { success: true, message: '已确认预约' }
  }

  function rejectBooking(bookingId, reviewRemark = '') {
    const booking = bookings.value.find(b => b.id === bookingId)
    if (!booking) {
      return { success: false, message: '预约不存在' }
    }
    if (booking.status !== 'pending') {
      return { success: false, message: '该预约已处理' }
    }

    booking.status = 'rejected'
    booking.reviewedAt = new Date().toISOString()
    booking.reviewRemark = reviewRemark
    persist()

    return { success: true, message: '已拒绝预约' }
  }

  function cancelBooking(bookingId) {
    const booking = bookings.value.find(b => b.id === bookingId)
    if (!booking) {
      return { success: false, message: '预约不存在' }
    }
    if (booking.status !== 'pending') {
      return { success: false, message: '只能取消待审批的预约' }
    }

    booking.status = 'cancelled'
    booking.reviewedAt = new Date().toISOString()
    persist()

    return { success: true, message: '预约已取消' }
  }

  return {
    bookings,
    pendingBookings,
    getBookingsByUser,
    getBookingsByService,
    createBooking,
    approveBooking,
    rejectBooking,
    cancelBooking
  }
})
