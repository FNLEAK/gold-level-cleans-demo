import { motion } from 'framer-motion'
import {
  Calendar,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Loader2,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  User,
  Users,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { SelectField } from '../components/SelectField'
import { pricingTiers } from '../data/siteContent'
import { useAuth } from '../context/AuthContext'
import {
  cancelBooking,
  createOwnerBooking,
  formatDisplayDate,
  getOwnerDashboard,
  upcomingDateOptions,
  WEEKLY_BOOKING_CAP,
  type Booking,
  type OwnerDashboard,
} from '../lib/api'

type Tab = 'upcoming' | 'week' | 'all'

const serviceOptions = pricingTiers.filter((t) => !t.addon).map((t) => t.name)

function initials(name?: string) {
  const parts = name?.trim().split(/\s+/) ?? []
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatDateOption(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return {
    label: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    hint: d.toLocaleDateString('en-US', { year: 'numeric' }),
  }
}

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tabular-nums text-white sm:text-4xl">
            {value}
          </p>
          <p className="mt-1.5 text-xs text-fog">{hint}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-muted/80 text-gold-400 shadow-[0_0_24px_-8px_rgba(212,175,55,0.45)]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </div>
  )
}

function OwnerBookingCard({
  booking,
  onCancel,
  cancelling,
}: {
  booking: Booking
  onCancel: (id: string) => void
  cancelling: string | null
}) {
  const isCancelled = booking.status === 'cancelled'
  const today = new Date().toISOString().slice(0, 10)
  const isUpcoming = !isCancelled && booking.date >= today
  const isPast = !isCancelled && booking.date < today

  return (
    <motion.li
      layout
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-void-200/80 to-void-200/40 p-5 backdrop-blur-sm transition hover:border-gold-400/20 sm:p-6"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold-400/80 to-gold-600/20 opacity-0 transition group-hover:opacity-100" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-white">{booking.name}</p>
              {booking.source === 'owner' ? (
                <span className="rounded-full bg-gold-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-400 ring-1 ring-gold-400/20">
                  Owner added
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-medium text-gold-400">{booking.service}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-fog">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-gold-400/80" aria-hidden />
              {formatDisplayDate(booking.date)}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fog">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3 text-gold-400/60" aria-hidden />
                {booking.email}
              </span>
              {booking.phone ? (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3 text-gold-400/60" aria-hidden />
                  {booking.phone}
                </span>
              ) : null}
            </div>
            {booking.notes ? (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fog/90">{booking.notes}</p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              isCancelled
                ? 'bg-red-500/15 text-red-300 ring-1 ring-red-500/20'
                : isUpcoming
                  ? 'bg-gold-muted text-gold-400 ring-1 ring-gold-400/25'
                  : isPast
                    ? 'bg-white/[0.06] text-fog ring-1 ring-white/10'
                    : 'bg-white/[0.06] text-fog ring-1 ring-white/10'
            }`}
          >
            {isUpcoming ? <Clock className="h-3 w-3" aria-hidden /> : null}
            {isCancelled ? 'cancelled' : isPast ? 'completed' : booking.status}
          </span>
          {!isCancelled && isUpcoming ? (
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              disabled={cancelling === booking.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-fog transition hover:border-red-500/40 hover:text-red-300 disabled:opacity-40"
            >
              {cancelling === booking.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <XCircle className="h-3.5 w-3.5" aria-hidden />
              )}
              Cancel job
            </button>
          ) : null}
        </div>
      </div>
    </motion.li>
  )
}

function AddScheduleForm({
  onCreated,
  onError,
}: {
  onCreated: () => void
  onError: (msg: string) => void
}) {
  const dates = upcomingDateOptions(56)
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? '')
  const [selectedService, setSelectedService] = useState<string>(serviceOptions[0] ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const dateOptions = useMemo(
    () => dates.map((d) => ({ value: d, ...formatDateOption(d) })),
    [dates],
  )

  const serviceSelectOptions = useMemo(
    () => serviceOptions.map((s) => ({ value: s, label: s })),
    [],
  )

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSubmitting(true)
    onError('')
    setSuccess(false)

    try {
      await createOwnerBooking({
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''),
        date: selectedDate,
        service: selectedService,
        notes: String(form.get('notes') ?? ''),
      })
      e.currentTarget.reset()
      setSuccess(true)
      onCreated()
      window.setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not save schedule')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gold-400/20 bg-void-200/60 p-5 backdrop-blur-sm sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400/25 to-gold-600/10 text-gold-400 ring-1 ring-gold-400/20">
            <CalendarPlus className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-white">Add client schedule</h2>
            <p className="mt-1 text-sm text-fog">
              Manually book a client for a specific date. Counts toward the weekly cap but owner
              entries can exceed {WEEKLY_BOOKING_CAP} if needed.
            </p>
          </div>
        </div>

        {success ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-muted/30 px-4 py-3 text-sm text-gold-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            Client scheduled and saved to your dashboard.
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gold-400">
                Client name
              </span>
              <div className="relative rounded-xl border border-white/10 bg-void-200/80 focus-within:border-gold-400/45 focus-within:ring-2 focus-within:ring-gold-400/15">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog/70" />
                <input
                  name="name"
                  required
                  placeholder="Full name"
                  className="w-full rounded-xl bg-transparent py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-fog/70"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gold-400">
                Email
              </span>
              <div className="relative rounded-xl border border-white/10 bg-void-200/80 focus-within:border-gold-400/45 focus-within:ring-2 focus-within:ring-gold-400/15">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog/70" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="client@email.com"
                  className="w-full rounded-xl bg-transparent py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-fog/70"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gold-400">
                Phone
              </span>
              <div className="relative rounded-xl border border-white/10 bg-void-200/80 focus-within:border-gold-400/45 focus-within:ring-2 focus-within:ring-gold-400/15">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog/70" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="(765) 555-0100"
                  className="w-full rounded-xl bg-transparent py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-fog/70"
                />
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="owner-schedule-date"
              label="Service date"
              value={selectedDate}
              onChange={setSelectedDate}
              options={dateOptions}
              required
            />
            <SelectField
              id="owner-schedule-service"
              label="Service type"
              value={selectedService}
              onChange={setSelectedService}
              options={serviceSelectOptions}
              required
            />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gold-400">
              Notes
            </span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Home size, access instructions, add-ons…"
              className="input-field resize-none text-sm"
            />
          </label>

          <button type="submit" disabled={submitting} className="btn-primary w-full !min-h-11">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              <>
                <CalendarPlus className="h-4 w-4" aria-hidden />
                Add to schedule
              </>
            )}
          </button>
        </form>
    </div>
  )
}

export function OwnerDashboardPage() {
  const { user, signOut } = useAuth()
  const [data, setData] = useState<OwnerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('upcoming')

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true)
    try {
      setData(await getOwnerDashboard())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load dashboard')
    } finally {
      setLoading(false)
      if (!silent) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    refresh(true)
    const id = window.setInterval(() => refresh(true), 30_000)
    return () => window.clearInterval(id)
  }, [refresh])

  async function handleCancel(id: string) {
    if (!confirm('Cancel this booking?')) return
    setCancelling(id)
    try {
      await cancelBooking(id)
      await refresh(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed')
    } finally {
      setCancelling(null)
    }
  }

  const listBookings = useMemo(() => {
    if (!data) return []
    if (tab === 'week') return data.bookingsThisWeek
    if (tab === 'all') return data.allBookings
    return data.upcomingBookings
  }, [data, tab])

  const firstName = user?.name?.split(' ')[0] ?? 'Mykala'

  return (
    <section className="relative overflow-hidden px-[max(1rem,env(safe-area-inset-left))] pb-[max(4rem,env(safe-area-inset-bottom))] pt-6 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-20 md:pt-10">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-gold-400/[0.07] blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-muted/30 via-void-200/90 to-void-200/50 p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8"
        >
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
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
                  Owner admin
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
                  Welcome, {firstName}
                </h1>
                <p className="mt-2 text-pretty text-sm text-fog">
                  Manage schedules · live stats every 30s · max {WEEKLY_BOOKING_CAP} jobs/week
                </p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center lg:justify-end">
              <button
                type="button"
                onClick={() => refresh(false)}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-mist backdrop-blur-sm hover:bg-void-300 sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
                Refresh
              </button>
              <Link to="/" className="btn-secondary w-full !min-h-11 !px-4 !py-2.5 !text-xs sm:w-auto">
                View site
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-fog hover:text-mist sm:w-auto"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-center sm:px-6">
            <p className="text-sm text-red-300">{error}</p>
            <p className="mt-2 text-xs text-fog">
              Make sure the API is running: use{' '}
              <code className="rounded bg-black/30 px-1.5 py-0.5 text-gold-400">npm run dev</code>{' '}
              (not dev:client alone).
            </p>
            <button
              type="button"
              onClick={() => refresh(false)}
              className="btn-secondary mt-4 !min-h-10 !px-5 !text-xs"
            >
              Try again
            </button>
          </div>
        ) : null}

        {loading && !data ? (
          <div className="mt-20 flex flex-col items-center gap-4 text-fog">
            <Loader2 className="h-9 w-9 animate-spin text-gold-400" />
            <p className="text-sm">Loading owner dashboard…</p>
          </div>
        ) : data ? (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Online now"
                value={data.onlineUsers}
                hint="Visitors last 60 sec"
                icon={Users}
              />
              <StatTile
                label="This week"
                value={`${data.bookedThisWeek} / ${WEEKLY_BOOKING_CAP}`}
                hint={data.week.label}
                icon={CalendarCheck}
                accent
              />
              <StatTile
                label="Upcoming"
                value={data.upcomingCount}
                hint="Scheduled ahead"
                icon={Clock}
              />
              <StatTile
                label="Completed"
                value={data.completedCount}
                hint={`${data.cancelledCount} cancelled total`}
                icon={Sparkles}
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <AddScheduleForm
                  onCreated={() => refresh(true)}
                  onError={(msg) => setFormError(msg)}
                />
                {formError ? (
                  <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {formError}
                  </p>
                ) : null}
              </div>

              <div className="lg:col-span-3">
                <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-void-200/40 backdrop-blur-sm">
                  <div className="border-b border-white/[0.06] px-5 py-5 sm:px-7 sm:py-6">
                    <h2 className="font-display text-xl font-semibold text-white">Schedule tracker</h2>
                    <p className="mt-1 text-sm text-fog">All client jobs by date</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(
                        [
                          ['upcoming', 'Upcoming', data.upcomingCount],
                          ['week', 'This week', data.bookingsThisWeek.length],
                          ['all', 'All jobs', data.allBookings.length],
                        ] as const
                      ).map(([key, label, count]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTab(key)}
                          className={`min-h-11 rounded-full px-4 py-2.5 text-xs font-semibold transition [touch-action:manipulation] ${
                            tab === key
                              ? 'bg-gold-400 text-void shadow-[0_0_20px_-6px_rgba(212,175,55,0.6)]'
                              : 'border border-white/10 bg-void-200/60 text-fog hover:text-mist'
                          }`}
                        >
                          {label}
                          <span className="ml-1.5 tabular-nums opacity-80">({count})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-[min(70vh,640px)] overflow-y-auto p-5 sm:p-7">
                    {listBookings.length === 0 ? (
                      <div className="flex flex-col items-center rounded-2xl border border-dashed border-gold-400/20 bg-gold-muted/10 px-6 py-14 text-center">
                        <Calendar className="h-10 w-10 text-gold-400/70" aria-hidden />
                        <p className="mt-5 font-display text-lg font-semibold text-white">
                          No jobs in this view
                        </p>
                        <p className="mt-2 max-w-sm text-sm text-fog">
                          Add a client schedule above, or wait for online bookings from the Book
                          Now page.
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {listBookings.map((b) => (
                          <OwnerBookingCard
                            key={b.id}
                            booking={b}
                            onCancel={handleCancel}
                            cancelling={cancelling}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : !loading ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-void-200/40 px-6 py-10 text-center">
            <p className="font-display text-lg font-semibold text-white">Dashboard unavailable</p>
            <p className="mt-2 text-sm text-fog">Could not load owner data. Check that the server is running.</p>
            <button type="button" onClick={() => refresh(false)} className="btn-primary mt-6 !min-h-11">
              Retry
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
