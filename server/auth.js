import { scryptSync, randomBytes, timingSafeEqual, randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, 'data', 'users.json')
const SESSIONS_FILE = path.join(__dirname, 'data', 'sessions.json')

const OWNER_EMAIL = (process.env.OWNER_EMAIL || 'MykalaAshbaugh353@gmail.com').toLowerCase()
const OWNER_DEFAULT_PASSWORD = process.env.OWNER_PASSWORD || 'GoldLevel353'
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@goldlevelcleans.com').toLowerCase()
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'GoldAdmin353'

/** Session TTL — stay signed in for 30 days (refreshed on each request). */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

/** @type {Map<string, { userId: string, role: 'owner' | 'customer', email: string, name: string, expiresAt: number }>} */
const sessions = new Map()

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuf = Buffer.from(hash, 'hex')
  const test = scryptSync(password, salt, 64)
  return timingSafeEqual(hashBuf, test)
}

function ensureDataDir() {
  const dir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function ensureUsers() {
  ensureDataDir()
  if (!fs.existsSync(USERS_FILE)) {
    const seed = {
      owner: {
        id: 'owner-1',
        name: 'Mykala Ashbaugh',
        email: OWNER_EMAIL,
        passwordHash: hashPassword(OWNER_DEFAULT_PASSWORD),
      },
      admin: {
        id: 'admin-1',
        name: 'Gold Level Admin',
        email: ADMIN_EMAIL,
        passwordHash: hashPassword(ADMIN_DEFAULT_PASSWORD),
      },
      customers: [],
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(seed, null, 2))
    return
  }

  const data = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
  let changed = false
  if (!data.admin) {
    data.admin = {
      id: 'admin-1',
      name: 'Gold Level Admin',
      email: ADMIN_EMAIL,
      passwordHash: hashPassword(ADMIN_DEFAULT_PASSWORD),
    }
    changed = true
  }
  if (changed) writeUsers(data)
}

function readUsers() {
  ensureUsers()
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function writeUsers(data) {
  ensureDataDir()
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2))
}

function loadSessions() {
  ensureDataDir()
  if (!fs.existsSync(SESSIONS_FILE)) return

  const now = Date.now()
  const raw = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'))
  let changed = false

  for (const [token, session] of Object.entries(raw)) {
    if (session.expiresAt > now) {
      sessions.set(token, session)
    } else {
      changed = true
    }
  }

  if (changed) persistSessions()
}

function persistSessions() {
  ensureDataDir()
  const obj = Object.fromEntries(sessions.entries())
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2))
}

function createToken() {
  return randomUUID() + randomUUID().replace(/-/g, '')
}

function storeSession(user, role) {
  const token = createToken()
  const session = {
    userId: user.id,
    role,
    email: user.email,
    name: user.name,
    expiresAt: Date.now() + SESSION_TTL_MS,
  }
  sessions.set(token, session)
  persistSessions()
  return { token, session }
}

function touchSession(token, session) {
  session.expiresAt = Date.now() + SESSION_TTL_MS
  sessions.set(token, session)
  persistSessions()
}

function findOwnerAccount(data, normalizedEmail) {
  if (data.owner?.email === normalizedEmail) return data.owner
  if (data.admin?.email === normalizedEmail) return data.admin
  return null
}

export function getSession(token) {
  if (!token) return null
  const session = sessions.get(token)
  if (!session) return null
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token)
    persistSessions()
    return null
  }
  return session
}

function parseToken(req) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) return header.slice(7)
  return req.headers['x-auth-token'] || null
}

export function requireAuth(req, res, next) {
  const token = parseToken(req)
  const session = getSession(token)
  if (!session) {
    res.status(401).json({ error: 'Sign in required.' })
    return
  }
  touchSession(token, session)
  req.auth = session
  req.authToken = token
  next()
}

export function requireOwner(req, res, next) {
  requireAuth(req, res, () => {
    if (req.auth.role !== 'owner') {
      res.status(403).json({ error: 'Owner access only.' })
      return
    }
    next()
  })
}

export function requireCustomer(req, res, next) {
  requireAuth(req, res, () => {
    if (req.auth.role !== 'customer') {
      res.status(403).json({ error: 'Customer account required.' })
      return
    }
    next()
  })
}

export function registerAuthRoutes(app) {
  ensureUsers()
  loadSessions()

  app.post('/api/auth/customer/register', (req, res) => {
    const { name, email, password, phone } = req.body
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400).json({ error: 'Name, email, and password are required.' })
      return
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' })
      return
    }

    const normalized = email.trim().toLowerCase()
    const data = readUsers()

    if (findOwnerAccount(data, normalized)) {
      res.status(400).json({ error: 'Use owner sign-in for this email.' })
      return
    }
    if (data.customers.some((c) => c.email === normalized)) {
      res.status(409).json({ error: 'An account with this email already exists.' })
      return
    }

    const customer = {
      id: randomUUID(),
      name: name.trim(),
      email: normalized,
      phone: phone?.trim() || '',
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    }
    data.customers.push(customer)
    writeUsers(data)

    const { token } = storeSession(
      { id: customer.id, name: customer.name, email: customer.email },
      'customer',
    )

    res.status(201).json({
      token,
      user: { id: customer.id, name: customer.name, email: customer.email, role: 'customer' },
    })
  })

  app.post('/api/auth/customer/login', (req, res) => {
    const { email, password } = req.body
    if (!email?.trim() || !password?.trim()) {
      res.status(400).json({ error: 'Email and password required.' })
      return
    }

    const normalized = email.trim().toLowerCase()
    const data = readUsers()
    const customer = data.customers.find((c) => c.email === normalized)

    if (!customer || !verifyPassword(password, customer.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password.' })
      return
    }

    const { token } = storeSession(
      { id: customer.id, name: customer.name, email: customer.email },
      'customer',
    )

    res.json({
      token,
      user: { id: customer.id, name: customer.name, email: customer.email, role: 'customer' },
    })
  })

  app.post('/api/auth/owner/login', (req, res) => {
    const { email, password } = req.body
    if (!email?.trim() || !password?.trim()) {
      res.status(400).json({ error: 'Email and password required.' })
      return
    }

    const data = readUsers()
    const normalized = email.trim().toLowerCase()
    const account = findOwnerAccount(data, normalized)

    if (!account || !verifyPassword(password, account.passwordHash)) {
      res.status(401).json({ error: 'Invalid owner credentials.' })
      return
    }

    const { token } = storeSession(
      { id: account.id, name: account.name, email: account.email },
      'owner',
    )

    res.json({
      token,
      user: { id: account.id, name: account.name, email: account.email, role: 'owner' },
    })
  })

  app.get('/api/auth/me', (req, res) => {
    const token = parseToken(req)
    const session = getSession(token)
    if (!session) {
      res.status(401).json({ error: 'Not signed in.' })
      return
    }
    touchSession(token, session)
    res.json({
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    })
  })

  app.post('/api/auth/logout', (req, res) => {
    const token = parseToken(req)
    if (token) {
      sessions.delete(token)
      persistSessions()
    }
    res.json({ ok: true })
  })
}

export function attachAuthToBooking(booking, session) {
  if (session?.role === 'customer') {
    booking.customerId = session.userId
  }
  return booking
}

// Load persisted sessions when the module is imported (server startup).
loadSessions()
