import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  ChevronRight,
  Clock,
  Home,
  Loader2,
  LogOut,
  Mail,
  Sparkles,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShinyText } from '../components/reactbits/ShinyText'
import { useAuth } from '../context/AuthContext'
import {
  formatDisplayDate,
  getCustomerDashboard,
  type Booking,
  type CustomerDashboard,
} from '../lib/api'
import { fetchCustomerBookings } from '../lib/supabase-bookings'
import { isSupabaseConfigured } from '../lib/supabase'

const easeOut = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
}

function initials(name?: string) {
  const parts = name?.trim().split(/\s+/) ?? []
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  hint: string
  icon: typeof Calendar
  accent?: boolean
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-sm transition hover:border-gold-400/35 sm:p-6 ${
        accent
          ? 'border-gold-400/30 bg-gradient-to-br from-gold-muted/50 to-void-200/60'
          : 'border-white/[0.08] bg-void-200/50'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold-400/10 blur-2xl transition group-hover:bg-gold-400/15"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-400">
            {label}
          </p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums text-white">{value}</p>
          <p className="mt-1.5 text-xs text-fog">{hint}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-muted/80 text-gold-400 shadow-[0_0_24px_-8px_rgba(212,175,55,0.45)]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </div>
  )
}

function QuickAction({
  to,
  label,
  desc,
  icon: Icon,
}: {
  to: string
  label: string
  desc: string
  icon: typeof Home
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-void-200/40 p-4 text-left transition hover:border-gold-400/25 hover:bg-void-200/70 [touch-action:manipulation] sm:p-5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 text-gold-400 ring-1 ring-gold-400/15 transition group-hover:scale-105">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-mist">{label}</span>
        <span className="mt-0.5 block text-xs text-fog">{desc}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-fog transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
    </Link>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const isCancelled = booking.status === 'cancelled'
  const isUpcoming = !isCancelled && booking.date >= new Date().toISOString().slice(0, 10)

  return (
    <motion.li
      layout
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-void-200/80 to-void-200/40 p-5 backdrop-blur-sm transition hover:border-gold-400/20 sm:p-6"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold-400/80 to-gold-600/20 opacity-0 transition group-hover:opacity-100" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-gold-400/20 bg-gold-muted/60 text-center">
            <span className="text-[10px] font-bold uppercase leading-none text-gold-400">
              {new Date(`${booking.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="font-display text-lg font-bold leading-tight text-white">
              {new Date(`${booking.date}T12:00:00`).getDate()}
            </span>
          </div>
          <div className="min-w-0 text-left">
            <p className="font-semibold text-white">{booking.service}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-fog">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-gold-400/80" aria-hidden />
              {formatDisplayDate(booking.date)}
            </p>
            {booking.notes ? (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fog/90">{booking.notes}</p>
            ) : null}
          </div>
        </div>
        <span
          className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
            isCancelled
              ? 'bg-red-500/15 text-red-300 ring-1 ring-red-500/20'
              : isUpcoming
                ? 'bg-gold-muted text-gold-400 ring-1 ring-gold-400/25'
                : 'bg-white/[0.06] text-fog ring-1 ring-white/10'
          }`}
        >
          {isUpcoming ? <Clock className="h-3 w-3" aria-hidden /> : null}
          {booking.status}
        </span>
      </div>
    </motion.li>
  )
}

export function CustomerDashboardPage() {
  const { user, signOut } = useAuth()
  const [data, setData] = useState<CustomerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      if (isSupabaseConfigured() && user?.email) {
        const bookings = await fetchCustomerBookings(user.email)
        const today = new Date().toISOString().slice(0, 10)
        const upcomingBookings = bookings.filter(
          (b) => b.status !== 'cancelled' && b.date >= today,
        )
        setData({
          user: { name: user.name, email: user.email },
          bookings,
          upcomingBookings,
          totalBookings: bookings.length,
        })
      } else {
        setData(await getCustomerDashboard())
      }
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load dashboard')
    } finally {
      setLoading(false)
    }
  }, [user?.email, user?.id, user?.name])

  useEffect(() => {
    load()
  }, [load])

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const stats = useMemo(() => {
    if (!data) return { upcoming: 0, total: 0, completed: 0 }
    const upcoming = data.upcomingBookings.length
    const total = data.totalBookings
    return { upcoming, total, completed: Math.max(0, total - upcoming) }
  }, [data])

  return (
    <section className="relative overflow-hidden px-[max(1rem,env(safe-area-inset-left))] pb-16 pt-8 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-20 md:pt-10">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-gold-400/[0.07] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-48 w-48 rounded-full bg-gold-500/[0.05] blur-[80px]"
        aria-hidden
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-5xl"
      >
        {/* Welcome hero panel */}
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-muted/30 via-void-200/90 to-void-200/50 p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.08)_0%,transparent_45%,transparent_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg,#d4af37 0,#d4af37 1px,transparent 1px,transparent 48px)',
            }}
            aria-hidden
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:text-left">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 font-display text-xl font-bold text-void shadow-[0_0_40px_-8px_rgba(212,175,55,0.65)] ring-2 ring-gold-400/30">
                  {initials(user?.name)}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-void-200 bg-gold-400 text-void">
                  <Sparkles className="h-3 w-3" aria-hidden />
                </span>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  My account
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
                  Welcome back, {firstName}
                </h1>
                <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-fog sm:justify-start">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-gold-400/70" aria-hidden />
                    {user?.email}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:items-end">
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-fog backdrop-blur-sm transition hover:border-white/20 hover:text-mist"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
              <Link
                to="/book"
                className="btn-primary group !min-h-11 !px-6 !py-2.5 !text-sm shadow-[0_0_32px_-8px_rgba(212,175,55,0.55)]"
              >
                Book a clean
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {error ? (
          <motion.p
            variants={item}
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
          >
            {error}
          </motion.p>
        ) : null}

        {loading ? (
          <motion.div variants={item} className="mt-20 flex flex-col items-center gap-4 text-fog">
            <Loader2 className="h-9 w-9 animate-spin text-gold-400" />
            <p className="text-sm">Loading your dashboard…</p>
          </motion.div>
        ) : data ? (
          <>
            <motion.div variants={item} className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatTile
                label="Total bookings"
                value={stats.total}
                hint="All time with Gold Level"
                icon={CalendarCheck}
                accent
              />
              <StatTile
                label="Upcoming"
                value={stats.upcoming}
                hint="Scheduled deep cleans"
                icon={Clock}
              />
              <StatTile
                label="Completed"
                value={stats.completed}
                hint="Past visits on record"
                icon={Sparkles}
              />
            </motion.div>

            <motion.div variants={item} className="mt-8">
              <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400 sm:text-left">
                Quick actions
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAction to="/book" label="Book online" desc="Pick your date" icon={Calendar} />
                <QuickAction to="/services" label="Services" desc="What we clean" icon={Sparkles} />
                <QuickAction to="/portfolio" label="Portfolio" desc="Past work" icon={Home} />
                <QuickAction to="/contact" label="Contact" desc="Get a quote" icon={Mail} />
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-void-200/40 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-2 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-xl font-semibold text-white">Your bookings</h2>
                  <p className="mt-1 text-sm text-fog">Track upcoming and past deep cleans</p>
                </div>
                <Link
                  to="/book"
                  className="mx-auto inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300 sm:mx-0"
                >
                  New booking
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="p-5 sm:p-7">
                {data.bookings.length === 0 ? (
                  <div className="flex flex-col items-center rounded-2xl border border-dashed border-gold-400/20 bg-gold-muted/10 px-6 py-14 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/25 bg-gold-muted/50 text-gold-400">
                      <Calendar className="h-8 w-8" aria-hidden />
                    </span>
                    <p className="mt-6 font-display text-lg font-semibold text-white">
                      No bookings yet
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-fog">
                      Schedule your first{' '}
                      <ShinyText
                        text="gold-level deep clean"
                        className="font-semibold"
                        speed={6}
                      />{' '}
                      and we will confirm by email.
                    </p>
                    <Link to="/book" className="btn-primary mt-8 !min-h-11 !px-8 !text-sm">
                      Schedule now
                    </Link>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {data.bookings.map((b) => (
                      <BookingCard key={b.id} booking={b} />
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </motion.div>
    </section>
  )
}
