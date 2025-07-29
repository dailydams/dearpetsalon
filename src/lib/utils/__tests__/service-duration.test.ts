import { calculateBookingDuration, calculateEndTime, calculateTotalPrice } from '../service-duration'
import { Service } from '@/types'

const mockServices: Service[] = [
  { id: '1', name: '목욕', duration_hours: 1, price: 30000, created_at: '2024-01-01' },
  { id: '2', name: '부분미용', duration_hours: 1, price: 25000, created_at: '2024-01-01' },
  { id: '3', name: '전체미용', duration_hours: 2, price: 50000, created_at: '2024-01-01' },
  { id: '4', name: '스포팅', duration_hours: 3, price: 70000, created_at: '2024-01-01' },
  { id: '5', name: '올컷', duration_hours: 3, price: 80000, created_at: '2024-01-01' },
  { id: '6', name: '얼컷', duration_hours: 1, price: 20000, created_at: '2024-01-01' },
]

describe('service-duration utils', () => {
  describe('calculateBookingDuration', () => {
    it('should return 0 for empty service IDs', () => {
      const duration = calculateBookingDuration([], mockServices)
      expect(duration).toBe(0)
    })

    it('should return 0 for non-existent service IDs', () => {
      const duration = calculateBookingDuration(['non-existent'], mockServices)
      expect(duration).toBe(0)
    })

    it('should return correct duration for single service', () => {
      const duration = calculateBookingDuration(['3'], mockServices) // 전체미용
      expect(duration).toBe(2)
    })

    it('should return 1 hour for 부분미용 + 목욕 combination', () => {
      const duration = calculateBookingDuration(['1', '2'], mockServices) // 목욕 + 부분미용
      expect(duration).toBe(1)
    })

    it('should return 1 hour for 부분미용 + 목욕 + 얼컷 combination', () => {
      const duration = calculateBookingDuration(['1', '2', '6'], mockServices) // 목욕 + 부분미용 + 얼컷
      expect(duration).toBe(1)
    })

    it('should return maximum duration for multiple services without special rules', () => {
      const duration = calculateBookingDuration(['3', '4'], mockServices) // 전체미용 + 스포팅
      expect(duration).toBe(3) // max(2, 3)
    })
  })

  describe('calculateEndTime', () => {
    it('should calculate correct end time', () => {
      const startTime = '2024-01-01T10:00:00.000Z'
      const endTime = calculateEndTime(startTime, 2)
      
      expect(endTime).toBe('2024-01-01T12:00:00.000Z')
    })

    it('should handle fractional hours', () => {
      const startTime = '2024-01-01T10:00:00.000Z'
      const endTime = calculateEndTime(startTime, 1.5)
      
      expect(endTime).toBe('2024-01-01T11:30:00.000Z')
    })
  })

  describe('calculateTotalPrice', () => {
    it('should return 0 for empty service IDs', () => {
      const total = calculateTotalPrice([], mockServices)
      expect(total).toBe(0)
    })

    it('should return 0 for non-existent service IDs', () => {
      const total = calculateTotalPrice(['non-existent'], mockServices)
      expect(total).toBe(0)
    })

    it('should calculate correct total for single service', () => {
      const total = calculateTotalPrice(['1'], mockServices) // 목욕
      expect(total).toBe(30000)
    })

    it('should calculate correct total for multiple services', () => {
      const total = calculateTotalPrice(['1', '2'], mockServices) // 목욕 + 부분미용
      expect(total).toBe(55000) // 30000 + 25000
    })

    it('should handle services without price', () => {
      const servicesWithoutPrice: Service[] = [
        { id: '1', name: '목욕', duration_hours: 1, created_at: '2024-01-01' },
      ]
      const total = calculateTotalPrice(['1'], servicesWithoutPrice)
      expect(total).toBe(0)
    })
  })
})