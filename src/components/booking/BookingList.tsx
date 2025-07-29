'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Booking } from '@/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Clock, User, Phone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BookingListProps {
  bookings: Booking[]
  onEdit: (booking: Booking) => void
  onDelete: (booking: Booking) => void
  loading?: boolean
}

const statusLabels = {
  scheduled: '예약됨',
  completed: '완료',
  cancelled: '취소됨',
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function BookingList({ bookings, onEdit, onDelete, loading }: BookingListProps) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)

  const handleToggleExpand = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId)
  }

  const handleDelete = (booking: Booking) => {
    if (confirm(`${booking.customer?.pet_name} (${booking.customer?.guardian_name})의 예약을 삭제하시겠습니까?`)) {
      onDelete(booking)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">예약이 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const isExpanded = expandedBooking === booking.id
        const startTime = new Date(booking.start_time)
        const endTime = new Date(booking.end_time)

        return (
          <div
            key={booking.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Main booking info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: booking.color }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.customer?.pet_name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({booking.customer?.guardian_name})
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      statusColors[booking.status]
                    )}>
                      {statusLabels[booking.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(startTime, 'M월 d일 (E) HH:mm', { locale: ko })} - 
                        {format(endTime, 'HH:mm')}
                      </span>
                    </div>
                    
                    {booking.customer?.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{booking.customer.phone}</span>
                      </div>
                    )}

                    {booking.total_price && (
                      <div className="font-medium text-purple-600">
                        {booking.total_price.toLocaleString()}원
                      </div>
                    )}
                  </div>

                  {/* Services preview */}
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {booking.services?.map((service) => (
                        <span
                          key={service.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleExpand(booking.id)}
                  >
                    {isExpanded ? '접기' : '자세히'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(booking)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(booking)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">고객 정보</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{booking.customer?.guardian_name}</span>
                      </div>
                      {booking.customer?.species && (
                        <p>견종: {booking.customer.species}</p>
                      )}
                      {booking.customer?.weight && (
                        <p>체중: {booking.customer.weight}kg</p>
                      )}
                      {booking.customer?.memo && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                          <strong>고객 메모:</strong> {booking.customer.memo}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">예약 정보</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>예약 일시: {format(startTime, 'yyyy년 M월 d일 (E) HH:mm', { locale: ko })}</p>
                      <p>종료 시간: {format(endTime, 'HH:mm')}</p>
                      <p>소요 시간: {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))}시간</p>
                      {booking.total_price && (
                        <p>총 금액: {booking.total_price.toLocaleString()}원</p>
                      )}
                      {booking.memo && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <strong>예약 메모:</strong> {booking.memo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services details */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">서비스 내역</h4>
                  <div className="space-y-2">
                    {booking.services?.map((service) => (
                      <div key={service.id} className="flex justify-between items-center text-sm">
                        <span>{service.name}</span>
                        <div className="text-gray-600">
                          {service.duration_hours}시간 • {service.price?.toLocaleString()}원
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}