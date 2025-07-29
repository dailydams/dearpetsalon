import { supabase } from '@/lib/supabase/client'
import { Booking } from '@/types'

export async function getBookings(startDate?: string, endDate?: string): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      customer:customers(*),
      services:services(*)
    `)
    .order('start_time')

  if (startDate && endDate) {
    query = query
      .gte('start_time', startDate)
      .lte('start_time', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getBooking(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:customers(*),
      services:services(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...booking,
      created_by: user.user.id,
      updated_at: new Date().toISOString(),
    })
    .select(`
      *,
      customer:customers(*),
      services:services(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function updateBooking(id: string, booking: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'created_by'>>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      ...booking,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      customer:customers(*),
      services:services(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getBookingsForMonth(year: number, month: number): Promise<Booking[]> {
  const startDate = new Date(year, month - 1, 1).toISOString()
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()
  
  return getBookings(startDate, endDate)
}