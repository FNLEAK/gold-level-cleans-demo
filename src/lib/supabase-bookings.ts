import { WEEKLY_BOOKING_CAP, type Booking, type OwnerDashboard, type WeekAvailability } from './api'
import { getSupabase, isSupabaseConfigured } from './supabase'
import type { BookingRow } from '../types/database'

export function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    name: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone ?? '',
    date: row.scheduled_date,
    startTime: row.start_time ? row.start_time.slice(0, 5) : undefined,
    service: row.service ?? '',
    notes: row.notes ?? '',
    budget: row.customer_budget ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    customerId: row.customer_id ?? undefined,
    source: row.source,
  }
}

function weekStartKey(isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00`)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

function formatWeekRange(weekKey: string) {
  const start = new Date(`${weekKey}T12:00:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return {
    start: weekKey,
    end: end.toISOString().slice(0, 10),
    label: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
  }
}

export async function submitBookingRequest(payload: {
  customer_name: string
  customer_email: string
  customer_phone?: string
  scheduled_date: string
  start_time: string
  service?: string
  notes?: string
  customer_budget?: string
  customer_id?: string
}) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: payload.customer_name,
      customer_email: payload.customer_email.trim().toLowerCase(),
      customer_phone: payload.customer_phone || null,
      scheduled_date: payload.scheduled_date,
      start_time: payload.start_time,
      service: payload.service || null,
      notes: payload.notes || null,
      customer_budget: payload.customer_budget?.trim() || null,
      status: 'pending',
      source: 'online',
      customer_id: payload.customer_id ?? null,
    })
    .select()
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (data) return mapBookingRow(data)

  return {
    id: crypto.randomUUID(),
    name: payload.customer_name,
    email: payload.customer_email.trim().toLowerCase(),
    phone: payload.customer_phone ?? '',
    date: payload.scheduled_date,
    startTime: payload.start_time.slice(0, 5),
    service: payload.service ?? '',
    notes: payload.notes ?? '',
    budget: payload.customer_budget?.trim() || undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
    customerId: payload.customer_id,
    source: 'online',
  }
}

export async function fetchAllBookingsForOwner() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('scheduled_date', { ascending: true })
    .order('start_time', { ascending: true, nullsFirst: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapBookingRow)
}

export async function fetchPendingBookings() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapBookingRow)
}

export async function confirmBooking(bookingId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapBookingRow(data)
}

export async function cancelBookingSupabase(bookingId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapBookingRow(data)
}

export async function createOwnerBookingSupabase(payload: {
  customer_name: string
  customer_email: string
  customer_phone?: string
  scheduled_date: string
  start_time?: string
  service?: string
  notes?: string
}) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: payload.customer_name,
      customer_email: payload.customer_email.trim().toLowerCase(),
      customer_phone: payload.customer_phone || null,
      scheduled_date: payload.scheduled_date,
      start_time: payload.start_time || null,
      service: payload.service || null,
      notes: payload.notes || null,
      status: 'confirmed',
      source: 'owner',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapBookingRow(data)
}

export async function fetchCustomerBookings(email: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_email', email.trim().toLowerCase())
    .order('scheduled_date', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapBookingRow)
}

export async function getAvailabilitySupabase(date: string): Promise<WeekAvailability> {
  const weekKey = weekStartKey(date)
  const week = formatWeekRange(weekKey)
  const start = new Date(`${weekKey}T12:00:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const endKey = end.toISOString().slice(0, 10)

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .gte('scheduled_date', weekKey)
    .lte('scheduled_date', endKey)
    .in('status', ['pending', 'confirmed'])

  if (error) throw new Error(error.message)

  const booked = data?.length ?? 0
  const remaining = Math.max(0, WEEKLY_BOOKING_CAP - booked)

  return {
    week,
    weekKey,
    cap: WEEKLY_BOOKING_CAP,
    booked,
    remaining,
    available: booked < WEEKLY_BOOKING_CAP,
  }
}

export function buildOwnerDashboardFromBookings(all: Booking[]): OwnerDashboard {
  const weekKey = weekStartKey(new Date().toISOString().slice(0, 10))
  const today = new Date().toISOString().slice(0, 10)
  const weekStart = new Date(`${weekKey}T12:00:00`)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const weekEndKey = weekEnd.toISOString().slice(0, 10)

  const active = all.filter((b) => b.status !== 'cancelled')
  const bookingsThisWeek = active.filter(
    (b) => b.date >= weekKey && b.date <= weekEndKey && b.status === 'confirmed',
  )
  const upcoming = active
    .filter((b) => b.status === 'confirmed' && b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const pending = all.filter((b) => b.status === 'pending')

  return {
    onlineUsers: 0,
    onlineSessions: [],
    week: formatWeekRange(weekKey),
    weekKey,
    cap: WEEKLY_BOOKING_CAP,
    bookedThisWeek: bookingsThisWeek.length,
    remainingThisWeek: Math.max(0, WEEKLY_BOOKING_CAP - bookingsThisWeek.length),
    bookingsThisWeek,
    upcomingBookings: upcoming,
    allBookings: [...all].sort((a, b) => b.date.localeCompare(a.date)),
    pendingBookings: pending,
    totalActiveBookings: active.length,
    upcomingCount: upcoming.length,
    pendingCount: pending.length,
    completedCount: active.filter((b) => b.status === 'confirmed' && b.date < today).length,
    cancelledCount: all.filter((b) => b.status === 'cancelled').length,
  }
}

export function subscribeToBookings(onChange: () => void) {
  if (!isSupabaseConfigured()) return () => {}
  const supabase = getSupabase()
  const channel = supabase
    .channel('bookings-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => onChange())
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}

export const START_TIME_OPTIONS = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
] as const

export function formatStartTime(t?: string) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m ?? 0, 0, 0)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
