export const WEEKLY_BOOKING_CAP = 7
const AUTH_KEY = 'glc-auth-token'

export type UserRole = 'owner' | 'customer'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type Booking = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  startTime?: string
  service: string
  notes: string
  status: string
  createdAt: string
  weekKey?: string
  customerId?: string
  source?: 'owner' | 'online'
}

export type OwnerDashboard = {
  onlineUsers: number
  onlineSessions: { id: string; path: string; lastSeen: number }[]
  week: { start: string; end: string; label: string }
  weekKey: string
  cap: number
  bookedThisWeek: number
  remainingThisWeek: number
  bookingsThisWeek: Booking[]
  upcomingBookings: Booking[]
  allBookings: Booking[]
  pendingBookings?: Booking[]
  totalActiveBookings: number
  upcomingCount: number
  pendingCount?: number
  completedCount: number
  cancelledCount: number
}

export type WeekAvailability = {
  week: { start: string; end: string; label: string }
  weekKey: string
  cap: number
  booked: number
  remaining: number
  available: boolean
}

export type CustomerDashboard = {
  user: { name: string; email: string }
  bookings: Booking[]
  upcomingBookings: Booking[]
  totalBookings: number
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    if (text.trimStart().startsWith('<')) {
      throw new Error(
        'Could not reach the sign-in server. Stop the app (Ctrl+C), run npm run dev again, and retry.',
      )
    }
    throw new Error('Unexpected server response. Please try again.')
  }
  if (!res.ok) {
    throw new Error(typeof (data as { error?: string }).error === 'string' ? (data as { error: string }).error : 'Request failed')
  }
  return data as T
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_KEY) ?? ''
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_KEY)
}

export async function customerRegister(payload: {
  name: string
  email: string
  password: string
  phone?: string
}) {
  const res = await fetch('/api/auth/customer/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseJson<{ token: string; user: User }>(res)
}

export async function customerLogin(email: string, password: string) {
  const res = await fetch('/api/auth/customer/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return parseJson<{ token: string; user: User }>(res)
}

export async function ownerLogin(email: string, password: string) {
  const res = await fetch('/api/auth/owner/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return parseJson<{ token: string; user: User }>(res)
}

export async function fetchMe() {
  const res = await fetch('/api/auth/me', { headers: { ...authHeaders() } })
  return parseJson<{ user: User }>(res)
}

export async function logoutApi() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { ...authHeaders() },
  })
  return parseJson<{ ok: boolean }>(res)
}

export async function sendHeartbeat(sessionId: string | null, pagePath: string) {
  const res = await fetch('/api/presence/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, path: pagePath }),
  })
  return parseJson<{ sessionId: string; online: number }>(res)
}

export async function getAvailability(date: string) {
  const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(date)}`)
  return parseJson<WeekAvailability>(res)
}

export async function createBooking(payload: {
  name: string
  email: string
  phone: string
  date: string
  service: string
  notes: string
}) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return parseJson<{ booking: Booking; remaining: number }>(res)
}

export async function createOwnerBooking(payload: {
  name: string
  email: string
  phone: string
  date: string
  service: string
  notes: string
}) {
  const res = await fetch('/api/owner/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return parseJson<{ booking: Booking; remaining: number }>(res)
}

export async function getCustomerDashboard() {
  const res = await fetch('/api/customer/dashboard', { headers: { ...authHeaders() } })
  return parseJson<CustomerDashboard>(res)
}

function normalizeWeek(raw: unknown): OwnerDashboard['week'] {
  if (raw && typeof raw === 'object' && 'label' in raw) {
    const w = raw as { start?: string; end?: string; label?: string }
    return {
      start: w.start ?? '',
      end: w.end ?? '',
      label: w.label ?? 'This week',
    }
  }
  if (typeof raw === 'string' && raw.trim()) {
    return { start: '', end: '', label: raw }
  }
  return { start: '', end: '', label: 'This week' }
}

export async function getOwnerDashboard() {
  const res = await fetch('/api/owner/dashboard', { headers: { ...authHeaders() } })
  const raw = await parseJson<Partial<OwnerDashboard> & { week?: unknown }>(res)
  const upcoming = Array.isArray(raw.upcomingBookings) ? raw.upcomingBookings : []
  const weekBookings = Array.isArray(raw.bookingsThisWeek) ? raw.bookingsThisWeek : []
  const all = Array.isArray(raw.allBookings)
    ? raw.allBookings
    : [...weekBookings, ...upcoming]
  const today = new Date().toISOString().slice(0, 10)

  return {
    onlineUsers: raw.onlineUsers ?? 0,
    onlineSessions: Array.isArray(raw.onlineSessions) ? raw.onlineSessions : [],
    week: normalizeWeek(raw.week),
    weekKey: raw.weekKey ?? '',
    cap: raw.cap ?? WEEKLY_BOOKING_CAP,
    bookedThisWeek: raw.bookedThisWeek ?? weekBookings.length,
    remainingThisWeek: raw.remainingThisWeek ?? 0,
    bookingsThisWeek: weekBookings,
    upcomingBookings: upcoming,
    allBookings: all,
    totalActiveBookings: raw.totalActiveBookings ?? upcoming.length,
    upcomingCount: raw.upcomingCount ?? upcoming.length,
    completedCount:
      raw.completedCount ??
      all.filter((b) => b.status !== 'cancelled' && b.date < today).length,
    cancelledCount: raw.cancelledCount ?? all.filter((b) => b.status === 'cancelled').length,
  } satisfies OwnerDashboard
}

export async function cancelBooking(bookingId: string) {
  const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: { ...authHeaders() },
  })
  return parseJson<{ booking: Booking }>(res)
}

export function getSessionId() {
  const key = 'glc-session-id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

export function upcomingDateOptions(count = 28) {
  const out: string[] = []
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  for (let i = 0; i < count; i++) {
    out.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return out
}

export function formatDisplayDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
