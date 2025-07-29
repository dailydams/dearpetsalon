import { Header } from '@/components/layout/Header'
import { BookingManager } from '@/components/booking/BookingManager'

export default function BookingsPage() {
  return (
    <div>
      <Header 
        title="예약 관리" 
        description="미용 예약을 등록하고 관리합니다"
      />
      <BookingManager />
    </div>
  )
}