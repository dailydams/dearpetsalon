'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Booking } from '@/types'
import { cn } from '@/lib/utils/cn'

interface BookingCalendarProps {
  bookings: Booking[]
  onDateClick: (date: Date, hour: number) => void
  loading?: boolean
}

export function BookingCalendar({ bookings, onDateClick, loading }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const weekDays = ['일', '월', '화', '수', '목', '금', '토']
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 9) // 9시부터 20시까지

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.start_time), date)
    )
  }

  const getBookingForTimeSlot = (date: Date, hour: number) => {
    return bookings.find(booking => {
      const bookingStart = new Date(booking.start_time)
      const bookingHour = bookingStart.getHours()
      return isSameDay(bookingStart, date) && bookingHour === hour
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleTimeSlotClick = (hour: number) => {
    if (selectedDate) {
      onDateClick(selectedDate, hour)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayBookings = getBookingsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "p-2 text-sm border border-transparent rounded-md transition-colors min-h-[60px] flex flex-col items-center justify-start",
                    isCurrentMonth ? "text-gray-900" : "text-gray-400",
                    isSelected && "bg-purple-100 border-purple-300",
                    isToday && !isSelected && "bg-blue-50 border-blue-200",
                    "hover:bg-gray-50"
                  )}
                >
                  <span className="font-medium">{format(day, 'd')}</span>
                  {dayBookings.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: booking.color }}
                        />
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayBookings.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-200 p-4">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">
                {format(selectedDate, 'M월 d일 (E)', { locale: ko })}
              </h3>
              <p className="text-sm text-gray-500">시간을 선택하여 예약을 등록하세요</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 lg:space-y-1 lg:max-h-96 lg:overflow-y-auto">
              {timeSlots.map((hour) => {
                const booking = getBookingForTimeSlot(selectedDate, hour)
                const timeString = `${hour.toString().padStart(2, '0')}:00`

                return (
                  <div key={hour} className="relative">
                    {booking ? (
                      <div
                        className="p-2 rounded text-xs text-white cursor-pointer"
                        style={{ backgroundColor: booking.color }}
                      >
                        <div className="font-medium truncate">
                          {booking.customer?.pet_name} ({booking.customer?.guardian_name})
                        </div>
                        <div className="opacity-90">
                          {timeString} - {format(new Date(booking.end_time), 'HH:mm')}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 text-left"
                        onClick={() => handleTimeSlotClick(hour)}
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        <span className="text-sm">{timeString}</span>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}