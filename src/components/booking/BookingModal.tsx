'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Booking, Customer } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CustomerAutocomplete } from './CustomerAutocomplete'
import { ServiceSelector } from './ServiceSelector'
import { ColorPicker } from './ColorPicker'
import { CustomerForm } from '../customer/CustomerForm'
import { calculateEndTime, calculateTotalPrice } from '@/lib/utils/service-duration'
import { createCustomer } from '@/lib/api/customers'
import { getServices } from '@/lib/api/services'

interface BookingModalProps {
  booking?: Booking | null
  selectedDate?: Date | null
  selectedHour?: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<void>
}

export function BookingModal({ 
  booking, 
  selectedDate, 
  selectedHour, 
  open, 
  onOpenChange, 
  onSubmit 
}: BookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [duration, setDuration] = useState(0)
  const [color, setColor] = useState('#8B5CF6')
  const [memo, setMemo] = useState('')
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [services, setServices] = useState([])

  // 초기값 설정
  useEffect(() => {
    if (booking) {
      setSelectedCustomer(booking.customer || null)
      setSelectedServiceIds(booking.service_ids)
      setColor(booking.color)
      setMemo(booking.memo || '')
    } else {
      setSelectedCustomer(null)
      setSelectedServiceIds([])
      setColor('#8B5CF6')
      setMemo('')
    }
  }, [booking])

  useEffect(() => {
    if (open) {
      loadServices()
    }
  }, [open])

  const loadServices = async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  const getStartTime = () => {
    if (booking) {
      return new Date(booking.start_time)
    }
    if (selectedDate && selectedHour !== null) {
      const date = new Date(selectedDate)
      date.setHours(selectedHour, 0, 0, 0)
      return date
    }
    return new Date()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCustomer || selectedServiceIds.length === 0) {
      alert('고객과 서비스를 선택해주세요.')
      return
    }

    setLoading(true)

    try {
      const startTime = getStartTime()
      const endTime = calculateEndTime(startTime.toISOString(), duration)
      const totalPrice = calculateTotalPrice(selectedServiceIds, services)

      await onSubmit({
        customer_id: selectedCustomer.id,
        service_ids: selectedServiceIds,
        start_time: startTime.toISOString(),
        end_time: endTime,
        color,
        status: 'scheduled',
        total_price: totalPrice,
        memo: memo || undefined,
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('예약 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleServiceChange = (serviceIds: string[], calculatedDuration: number) => {
    setSelectedServiceIds(serviceIds)
    setDuration(calculatedDuration)
  }

  const handleNewCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCustomer = await createCustomer(customerData)
      setSelectedCustomer(newCustomer)
      setShowCustomerForm(false)
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  }

  const startTime = getStartTime()
  const endTime = duration > 0 ? new Date(startTime.getTime() + duration * 60 * 60 * 1000) : null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[95vw] max-w-[95vw] sm:w-full sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {booking ? '예약 수정' : '새 예약 등록'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 날짜 및 시간 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">예약 날짜</Label>
                  <p className="font-medium">
                    {format(startTime, 'yyyy년 M월 d일 (E)', { locale: ko })}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">예약 시간</Label>
                  <p className="font-medium">
                    {format(startTime, 'HH:mm')}
                    {endTime && ` - ${format(endTime, 'HH:mm')}`}
                    {duration > 0 && ` (${duration}시간)`}
                  </p>
                </div>
              </div>
            </div>

            {/* 고객 선택 */}
            <CustomerAutocomplete
              selectedCustomer={selectedCustomer}
              onCustomerSelect={setSelectedCustomer}
              onNewCustomerClick={() => setShowCustomerForm(true)}
            />

            {/* 서비스 선택 */}
            <ServiceSelector
              selectedServiceIds={selectedServiceIds}
              onServiceChange={handleServiceChange}
            />

            {/* 색상 선택 */}
            <ColorPicker
              selectedColor={color}
              onColorChange={setColor}
            />

            {/* 메모 */}
            <div className="space-y-2">
              <Label htmlFor="memo">메모</Label>
              <textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="특이사항이나 요청사항을 입력하세요"
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                취소
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '저장 중...' : booking ? '수정' : '예약 등록'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 새 고객 등록 모달 */}
      <CustomerForm
        open={showCustomerForm}
        onOpenChange={setShowCustomerForm}
        onSubmit={handleNewCustomer}
      />
    </>
  )
}