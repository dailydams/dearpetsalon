import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Booking } from '@/types'
import { 
  getBookings, 
  getBooking, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  getBookingsForMonth 
} from '@/lib/api/bookings'
import { toast } from '@/hooks/use-toast'

export const BOOKINGS_QUERY_KEY = 'bookings'

export function useBookings(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, startDate, endDate],
    queryFn: () => getBookings(startDate, endDate),
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  })
}

export function useBookingsForMonth(year: number, month: number) {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, 'month', year, month],
    queryFn: () => getBookingsForMonth(year, month),
    staleTime: 2 * 60 * 1000, // 2분
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (newBooking) => {
      // 모든 예약 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] })
      
      toast({
        title: '예약 등록 완료',
        description: `${newBooking.customer?.pet_name} (${newBooking.customer?.guardian_name})의 예약이 등록되었습니다.`,
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: '예약 등록 실패',
        description: error.message || '예약 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'created_by'>> }) =>
      updateBooking(id, data),
    onSuccess: (updatedBooking) => {
      // 모든 예약 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] })
      
      toast({
        title: '예약 수정 완료',
        description: `${updatedBooking.customer?.pet_name} (${updatedBooking.customer?.guardian_name})의 예약이 수정되었습니다.`,
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: '예약 수정 실패',
        description: error.message || '예약 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      // 모든 예약 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] })
      
      toast({
        title: '예약 삭제 완료',
        description: '예약이 삭제되었습니다.',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: '예약 삭제 실패',
        description: error.message || '예약 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    },
  })
}