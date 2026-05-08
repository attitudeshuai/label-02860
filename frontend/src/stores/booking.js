/**
 * 预约状态管理
 *
 * 管理服务预约的创建、查询、审核等操作，数据持久化到 localStorage。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/utils/storage'

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
}

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: '待审核',
  [BOOKING_STATUS.APPROVED]: '已通过',
  [BOOKING_STATUS.REJECTED]: '已拒绝',
  [BOOKING_STATUS.CANCELLED]: '已取消'
}

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref(loadFromStorage(STORAGE_KEYS.BOOKINGS, []))

  const pendingBookings = computed(() =>
    bookings.value.filter(b => b.status === BOOKING_STATUS.PENDING)
  )

  const approvedBookings = computed(() =>
    bookings.value.filter(b => b.status === BOOKING_STATUS.APPROVED)
  )

  const rejectedBookings = computed(() =>
    bookings.value.filter(b => b.status === BOOKING_STATUS.REJECTED)
  )

  function getBookingsByUserId(userId) {
    return bookings.value.filter(b => b.userId === userId)
  }

  function getBookingById(id) {
    return bookings.value.find(b => b.id === Number(id)) || null
  }

  function isTimeSlotAvailable(serviceId, date, timeSlot) {
    return !bookings.value.some(
      b => b.serviceId === serviceId &&
           b.date === date &&
           b.timeSlot === timeSlot &&
           (b.status === BOOKING_STATUS.PENDING || b.status === BOOKING_STATUS.APPROVED)
    )
  }

  function getAvailableSlots(serviceId, date) {
    return TIME_SLOTS.filter(slot => isTimeSlotAvailable(serviceId, date, slot))
  }

  function createBooking(bookingData) {
    if (!isTimeSlotAvailable(bookingData.serviceId, bookingData.date, bookingData.timeSlot)) {
      return { success: false, message: '该时间段已被预约，请选择其他时间' }
    }

    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: BOOKING_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      reviewNote: '',
      reviewedBy: null
    }

    bookings.value.push(newBooking)
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings.value)

    return { success: true, message: '预约申请提交成功', booking: newBooking }
  }

  function updateBookingStatus(bookingId, status, reviewNote = '', reviewedBy = null) {
    const booking = getBookingById(bookingId)
    if (!booking) {
      return { success: false, message: '预约不存在' }
    }

    booking.status = status
    booking.reviewedAt = new Date().toISOString()
    booking.reviewNote = reviewNote
    booking.reviewedBy = reviewedBy

    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings.value)

    const statusLabels = {
      [BOOKING_STATUS.APPROVED]: '已通过',
      [BOOKING_STATUS.REJECTED]: '已拒绝',
      [BOOKING_STATUS.CANCELLED]: '已取消'
    }

    return { success: true, message: `预约${statusLabels[status] || '已更新'}` }
  }

  function approveBooking(bookingId, reviewNote = '', reviewedBy = null) {
    return updateBookingStatus(bookingId, BOOKING_STATUS.APPROVED, reviewNote, reviewedBy)
  }

  function rejectBooking(bookingId, reviewNote = '', reviewedBy = null) {
    return updateBookingStatus(bookingId, BOOKING_STATUS.REJECTED, reviewNote, reviewedBy)
  }

  function cancelBooking(bookingId) {
    return updateBookingStatus(bookingId, BOOKING_STATUS.CANCELLED)
  }

  return {
    bookings,
    pendingBookings,
    approvedBookings,
    rejectedBookings,
    getBookingsByUserId,
    getBookingById,
    isTimeSlotAvailable,
    getAvailableSlots,
    createBooking,
    updateBookingStatus,
    approveBooking,
    rejectBooking,
    cancelBooking
  }
})
