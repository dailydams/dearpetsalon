import { supabase } from '@/lib/supabase/client'

export interface RevenueData {
  date: string
  total: number
  bookings: number
}

export interface ServiceRevenueData {
  service_name: string
  revenue: number
  count: number
  percentage: number
}

export async function getRevenueByDateRange(startDate: string, endDate: string): Promise<RevenueData[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      start_time,
      total_price,
      status
    `)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .eq('status', 'completed')
    .order('start_time')

  if (error) throw error

  // 날짜별로 그룹화
  const revenueMap = new Map<string, { total: number; bookings: number }>()
  
  data?.forEach(booking => {
    const date = booking.start_time.split('T')[0] // YYYY-MM-DD 형식
    const current = revenueMap.get(date) || { total: 0, bookings: 0 }
    
    revenueMap.set(date, {
      total: current.total + (booking.total_price || 0),
      bookings: current.bookings + 1
    })
  })

  return Array.from(revenueMap.entries()).map(([date, data]) => ({
    date,
    total: data.total,
    bookings: data.bookings
  }))
}

export async function getServiceRevenue(startDate: string, endDate: string): Promise<ServiceRevenueData[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      service_ids,
      total_price,
      status,
      services:services(name, price)
    `)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .eq('status', 'completed')

  if (error) throw error

  // 서비스별 매출 집계
  const serviceMap = new Map<string, { revenue: number; count: number }>()
  let totalRevenue = 0

  data?.forEach(booking => {
    if (booking.services && Array.isArray(booking.services)) {
      booking.services.forEach((service: any) => {
        const current = serviceMap.get(service.name) || { revenue: 0, count: 0 }
        const serviceRevenue = service.price || 0
        
        serviceMap.set(service.name, {
          revenue: current.revenue + serviceRevenue,
          count: current.count + 1
        })
        
        totalRevenue += serviceRevenue
      })
    }
  })

  return Array.from(serviceMap.entries()).map(([serviceName, data]) => ({
    service_name: serviceName,
    revenue: data.revenue,
    count: data.count,
    percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
  }))
}

export async function getTotalRevenue(startDate: string, endDate: string): Promise<{
  total: number
  bookings: number
  avgPerBooking: number
}> {
  const { data, error } = await supabase
    .from('bookings')
    .select('total_price, status')
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .eq('status', 'completed')

  if (error) throw error

  const total = data?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0
  const bookings = data?.length || 0
  const avgPerBooking = bookings > 0 ? total / bookings : 0

  return {
    total,
    bookings,
    avgPerBooking
  }
}