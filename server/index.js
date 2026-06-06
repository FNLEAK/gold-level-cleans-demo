import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import {
  attachAuthToBooking,
  getSession,
  registerAuthRoutes,
  requireCustomer,
  requireOwner,
} from './auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')

const PORT = Number(process.env.PORT) || 3001
const WEEKLY_BOOKING_CAP = 7
const PRESENCE_TTL_MS = 60_000

let presenceSessions = {}

const app = express()
app.use(cors())
app.use(express.json())

registerAuthRoutes(app)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, auth: true })
})

function parseToken(req) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) return header.slice(7)
  return req.headers['x-auth-token'] || null
}

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify({ bookings: [] }, null, 2))
  }
}

function readBookings() {
  ensureDataFiles()
  return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'))
}

function writeBookings(data) {
  ensureDataFiles()
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(data, null, 2))
}

function getPresenceSessions() {
  presenceSessions = prunePresence(presenceSessions)
  return presenceSessions
}

function weekStartKey(dateInput) {
  const d = new Date(typeof dateInput === 'string' ? `${dateInput}T12:00:00` : dateInput)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(12, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

function activeBookings(bookings) {
  return bookings.filter((b) => b.status !== 'cancelled')
}

function bookingsForWeek(bookings, weekKey) {
  return activeBookings(bookings).filter((b) => weekStartKey(b.date) === weekKey)
}

function prunePresence(sessions) {
  const now = Date.now()
  const next = {}
  for (const [id, s] of Object.entries(sessions)) {
    if (now - s.lastSeen < PRESENCE_TTL_MS) next[id] = s
  }
  return next
}

function formatWeekRange(weekKey) {
  const start = new Date(`${weekKey}T12:00:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return {
    start: weekKey,
    end: end.toISOString().slice(0, 10),
    label: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
  }
}

function createBookingRecord(body, session, { allowOverCap = false } = {}) {
  const { name, email, phone, date, service, notes } = body

  if (!name?.trim() || !email?.trim() || !date?.trim()) {
    return { error: 'Name, email, and date are required.', status: 400 }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: 'Invalid date format.', status: 400 }
  }

  const bookingDate = new Date(`${date}T12:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (bookingDate < today) {
    return { error: 'Cannot schedule a date in the past.', status: 400 }
  }

  const { bookings } = readBookings()
  const weekKey = weekStartKey(date)
  const weekBookings = bookingsForWeek(bookings, weekKey)

  if (!allowOverCap && weekBookings.length >= WEEKLY_BOOKING_CAP) {
    return {
      error: `This week is full (${WEEKLY_BOOKING_CAP} bookings max). Choose another week or use owner override.`,
      status: 409,
      week: formatWeekRange(weekKey),
      cap: WEEKLY_BOOKING_CAP,
      booked: weekBookings.length,
    }
  }

  const booking = attachAuthToBooking(
    {
      id: randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      date,
      service: service?.trim() || 'Deep clean',
      notes: notes?.trim() || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      weekKey,
      source: allowOverCap ? 'owner' : 'online',
    },
    session,
  )

  bookings.push(booking)
  writeBookings({ bookings })

  return {
    booking,
    remaining: Math.max(0, WEEKLY_BOOKING_CAP - weekBookings.length - 1),
    status: 201,
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/presence/heartbeat', (req, res) => {
  const { sessionId, path: pagePath } = req.body
  const id = sessionId || randomUUID()
  const sessions = getPresenceSessions()
  sessions[id] = { lastSeen: Date.now(), path: pagePath || '/' }
  presenceSessions = sessions
  res.json({ sessionId: id, online: Object.keys(sessions).length })
})

app.get('/api/bookings/availability', (req, res) => {
  const { date } = req.query
  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: 'date query required (YYYY-MM-DD)' })
    return
  }

  const { bookings } = readBookings()
  const weekKey = weekStartKey(date)
  const weekBookings = bookingsForWeek(bookings, weekKey)
  const count = weekBookings.length

  res.json({
    week: formatWeekRange(weekKey),
    weekKey,
    cap: WEEKLY_BOOKING_CAP,
    booked: count,
    remaining: Math.max(0, WEEKLY_BOOKING_CAP - count),
    available: count < WEEKLY_BOOKING_CAP,
  })
})

app.post('/api/bookings', (req, res) => {
  const session = getSession(parseToken(req))
  const result = createBookingRecord(req.body, session)
  if (result.error) {
    res.status(result.status).json({
      error: result.error,
      week: result.week,
      cap: result.cap,
      booked: result.booked,
    })
    return
  }
  res.status(201).json({ booking: result.booking, remaining: result.remaining })
})

app.post('/api/owner/bookings', requireOwner, (req, res) => {
  const result = createBookingRecord(req.body, null, { allowOverCap: true })
  if (result.error) {
    res.status(result.status).json({ error: result.error })
    return
  }
  res.status(201).json({ booking: result.booking, remaining: result.remaining })
})

app.get('/api/customer/dashboard', requireCustomer, (req, res) => {
  const { bookings } = readBookings()
  const mine = bookings
    .filter(
      (b) =>
        b.customerId === req.auth.userId ||
        b.email?.toLowerCase() === req.auth.email.toLowerCase(),
    )
    .sort((a, b) => b.date.localeCompare(a.date))

  const upcoming = mine.filter(
    (b) => b.status !== 'cancelled' && b.date >= new Date().toISOString().slice(0, 10),
  )

  res.json({
    user: { name: req.auth.name, email: req.auth.email },
    bookings: mine,
    upcomingBookings: upcoming,
    totalBookings: mine.filter((b) => b.status !== 'cancelled').length,
  })
})

app.get('/api/owner/dashboard', requireOwner, (_req, res) => {
  const weekKey = weekStartKey(new Date())
  const today = new Date().toISOString().slice(0, 10)
  const { bookings } = readBookings()
  const weekBookings = bookingsForWeek(bookings, weekKey).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
  const sessions = getPresenceSessions()
  const active = activeBookings(bookings)
  const upcoming = active
    .filter((b) => b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const allBookings = [...bookings].sort((a, b) => b.date.localeCompare(a.date))
  const completed = active.filter((b) => b.date < today).length
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length

  res.json({
    onlineUsers: Object.keys(sessions).length,
    onlineSessions: Object.entries(sessions).map(([id, s]) => ({
      id: id.slice(0, 8),
      path: s.path,
      lastSeen: s.lastSeen,
    })),
    week: formatWeekRange(weekKey),
    weekKey,
    cap: WEEKLY_BOOKING_CAP,
    bookedThisWeek: weekBookings.length,
    remainingThisWeek: Math.max(0, WEEKLY_BOOKING_CAP - weekBookings.length),
    bookingsThisWeek: weekBookings,
    upcomingBookings: upcoming,
    allBookings,
    totalActiveBookings: active.length,
    upcomingCount: upcoming.length,
    completedCount: completed,
    cancelledCount: cancelled,
  })
})

app.patch('/api/bookings/:id/cancel', requireOwner, (req, res) => {
  const { bookings } = readBookings()
  const idx = bookings.findIndex((b) => b.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ error: 'Booking not found' })
    return
  }
  bookings[idx].status = 'cancelled'
  bookings[idx].cancelledAt = new Date().toISOString()
  writeBookings({ bookings })
  res.json({ booking: bookings[idx] })
})

const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

ensureDataFiles()

export default app

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Gold Level Cleans API on http://localhost:${PORT}`)
  })
}
