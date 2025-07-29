'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { Booking } from '@/types'
import { Button } from '@/components/ui/button'
import { BookingCalendar } from './BookingCalendar'
import { BookingList } from './BookingList'
import { BookingModal } from './BookingModal'
import { Calendar, List, Plus } from 'lucide-react'
import { getBookings, createBooking, updateBooking, deleteBooking } from '@/lib/api/bookings'
import { cn } from '@/lib/utils/cn'

type ViewMode = 'calendar' | 'list'

export function BookingManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    loadBookings()
  }, [currentMonth])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const startDate = startOfMonth(currentMonth).toISOString()
      const endDate = endOfMonth(currentMonth).toISOString()
      const data = await getBookings(startDate, endDate)
      setBookings(data)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (date: Date, hour: number) => {
    setSelectedDate(date)
    setSelectedHour(hour)
    setEditingBooking(null)
    setModalOpen(true)
  }

  const handleNewBooking = () => {
    setSelectedDate(new Date())
    setSelectedHour(9)
    setEditingBooking(null)
    setModalOpen(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setSelectedDate(null)
    setSelectedHour(null)
    setModalOpen(true)
  }

  const handleDeleteBooking = async (booking: Booking) => {
    try {
      await deleteBooking(booking.id)
      setBookings(prev => prev.filter(b => b.id !== booking.id))
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('예약 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleSubmitBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      if (editingBooking) {
        // 수정
        const updatedBooking = await updateBooking(editingBooking.id, bookingData)
        setBookings(prev => 
          prev.map(booking => 
            booking.id === editingBooking.id ? updatedBooking : booking
          )
        )
      } else {
        // 새 예약
        const newBooking = await createBooking(bookingData)
        setBookings(prev => [...prev, newBooking])
      }
      setModalOpen(false)
      setEditingBooking(null)
    } catch (error) {
      console.error('Error submitting booking:', error)
      throw error
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingBooking(null)
    setSelectedDate(null)
    setSelectedHour(null)
  }

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>달력</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>목록</span>
          </Button>
        </div>

        <Button onClick={handleNewBooking}>
          <Plus className="h-4 w-4 mr-2" />
          새 예약
        </Button>
      </div>

      {/* Current Month Display */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentMonth, 'yyyy년 M월')}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          총 {bookings.length}개의 예약
        </p>
      </div>

      {/* View Content */}
      {viewMode === 'calendar' ? (
        <BookingCalendar
          bookings={bookings}
          onDateClick={handleDateClick}
          loading={loading}
        />
      ) : (
        <BookingList
          bookings={bookings}
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
          loading={loading}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        booking={editingBooking}
        selectedDate={selectedDate}
        selectedHour={selectedHour}
        open={modalOpen}
        onOpenChange={handleModalClose}
        onSubmit={handleSubmitBooking}
      />
    </div>
  )
}