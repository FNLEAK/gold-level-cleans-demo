import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Loader2, Mail, Phone, User, Wallet } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  createBooking,
  formatDisplayDate,
  getAvailability,
  upcomingDateOptions,
  WEEKLY_BOOKING_CAP,
  type WeekAvailability,
} from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  getAvailabilitySupabase,
  START_TIME_OPTIONS,
  submitBookingRequest,
} from '../lib/supabase-bookings'
import { formatBookingServiceLabel, isStandardCleaningService } from '../data/siteContent'
import { useAuth } from '../context/AuthContext'
import { BookingServiceFields } from './BookingServiceFields'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { FadeContent } from './reactbits/FadeContent'
import { SelectField } from './SelectField'

const inputWrap =
  'relative rounded-2xl border border-white/10 bg-void-200/60 shadow-sm transition focus-within:border-gold-400/45 focus-within:ring-2 focus-within:ring-gold-400/15'

const inputInner =
  'w-full rounded-2xl bg-transparent px-4 py-3.5 font-sans text-base leading-normal text-white outline-none placeholder:text-fog/80'

function formatDateOption(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return {
    label: d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }),
    hint: d.toLocaleDateString('en-US', { year: 'numeric' }),
  }
}

export function BookingForm() {
  const { user } = useAuth()
  const dates = upcomingDateOptions()
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? '')
  const [selectedServiceId, setSelectedServiceId] = useState('standard')
  const [selectedFrequency, setSelectedFrequency] = useState('one-time')
  const [selectedTime, setSelectedTime] = useState<string>(START_TIME_OPTIONS[1]?.value ?? '09:00')
  const [availability, setAvailability] = useState<WeekAvailability | null>(null)
  const [loadingAvail, setLoadingAvail] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ date: string; remaining?: number } | null>(null)

  const dateOptions = useMemo(
    () =>
      dates.map((d) => {
        const { label, hint } = formatDateOption(d)
        return { value: d, label, hint }
      }),
    [dates],
  )

  const loadAvailability = useCallback(async (date: string) => {
    if (!date) return
    setLoadingAvail(true)
    setError('')
    try {
      const data = isSupabaseConfigured()
        ? await getAvailabilitySupabase(date)
        : await getAvailability(date)
      setAvailability(data)
    } catch {
      setAvailability(null)
      setError('Could not load availability. Make sure the server is running.')
    } finally {
      setLoadingAvail(false)
    }
  }, [])

  useEffect(() => {
    loadAvailability(selectedDate)
  }, [selectedDate, loadAvailability])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!availability?.available) {
      setError(`This week is full (${WEEKLY_BOOKING_CAP} jobs max). Pick a date in another week.`)
      return
    }

    const form = new FormData(e.currentTarget)
    setSubmitting(true)
    setError('')

    try {
      const name = String(form.get('name') ?? '')
      const email = String(form.get('email') ?? '')
      const phone = String(form.get('phone') ?? '')
      const notes = String(form.get('notes') ?? '')
      const budget = String(form.get('budget') ?? '').trim()
      const service = formatBookingServiceLabel(
        selectedServiceId,
        isStandardCleaningService(selectedServiceId) ? selectedFrequency : undefined,
      )

      if (isSupabaseConfigured()) {
        await submitBookingRequest({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          scheduled_date: selectedDate,
          start_time: selectedTime,
          service,
          notes,
          customer_budget: budget,
          customer_id: user?.id,
        })
        setSuccess({ date: selectedDate })
      } else {
        const notesWithBudget = [budget && `Budget: ${budget}`, notes].filter(Boolean).join('\n\n')
        const result = await createBooking({
          name,
          email,
          phone,
          date: selectedDate,
          service,
          notes: notesWithBudget,
        })
        setSuccess({ date: result.booking.date, remaining: result.remaining })
      }
      e.currentTarget.reset()
      loadAvailability(selectedDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <FadeContent className="mx-auto max-w-lg rounded-3xl border border-gold-400/30 bg-gold-muted p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold-400" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-semibold text-white">
          {isSupabaseConfigured() ? 'Request received!' : "You're booked!"}
        </h2>
        <p className="mt-3 text-fog">
          {isSupabaseConfigured()
            ? `We received your request for ${formatDisplayDate(success.date)}. Mykala will review your details and confirm your quote by email before your clean is scheduled.`
            : `${formatDisplayDate(success.date)}. We'll confirm by email shortly.`}
        </p>
        {success.remaining != null ? (
          <p className="mt-2 text-sm text-fog">
            {success.remaining} slot{success.remaining === 1 ? '' : 's'} left this week.
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-6 rounded-xl border border-white/10 bg-void-200/60 px-5 py-2.5 text-sm font-semibold text-mist hover:bg-void-300"
        >
          Book another date
        </button>
      </FadeContent>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
      <FadeContent className="lg:col-span-2">
        <GlowBorder className="h-full">
          <div className="rounded-3xl bg-void-200/60 p-6 sm:p-7">
          <div className="flex items-center gap-2 text-gold-400">
            <Calendar className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold tracking-wide">Weekly capacity</span>
          </div>
          {loadingAvail ? (
            <div className="mt-6 flex items-center gap-2 text-fog">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Checking availability…
            </div>
          ) : availability ? (
            <>
              <p className="mt-4 text-sm text-fog">{availability.week.label}</p>
              <p className="mt-2 font-display text-4xl font-bold text-white">
                {availability.booked}
                <span className="text-2xl font-medium text-fog"> / {availability.cap}</span>
              </p>
              <p className="mt-1 text-sm text-fog">bookings this week</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-void-300">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all"
                  style={{ width: `${(availability.booked / availability.cap) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-sm font-medium text-mist">
                {availability.available ? (
                  <>
                    <span className="text-gold-400">{availability.remaining}</span> slot
                    {availability.remaining === 1 ? '' : 's'} remaining
                  </>
                ) : (
                  <span className="text-red-400">This week is full. Choose another date.</span>
                )}
              </p>
            </>
          ) : null}
          <p className="mt-6 text-xs leading-relaxed text-fog/80">
            We limit to {WEEKLY_BOOKING_CAP} deep cleans per week so every home gets full attention.
          </p>
          </div>
        </GlowBorder>
      </FadeContent>

      <FadeContent delay={0.06} className="lg:col-span-3">
        <GlowBorder className="h-full">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl bg-void-200/60 p-6 sm:p-8"
          >
          {error ? (
            <p className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <SelectField
            id="book-date"
            label="Preferred date"
            value={selectedDate}
            onChange={setSelectedDate}
            options={dateOptions}
            required
            placeholder="Choose a date"
          />

          <div className="mt-5">
            <BookingServiceFields
              serviceId={selectedServiceId}
              frequency={selectedFrequency}
              onServiceChange={setSelectedServiceId}
              onFrequencyChange={setSelectedFrequency}
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectField
              id="book-time"
              label="Preferred start time"
              value={selectedTime}
              onChange={setSelectedTime}
              options={START_TIME_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
              required
            />
          </div>

          <div className="mt-5">
            <label htmlFor="book-name" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-fog">
              <User className="h-3.5 w-3.5" aria-hidden />
              Full name
            </label>
            <div className={`${inputWrap} mt-2`}>
              <input
                id="book-name"
                name="name"
                required
                defaultValue={user?.name ?? ''}
                key={`name-${user?.id ?? 'guest'}`}
                className={`${inputInner} min-h-[3.25rem]`}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="book-email" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-fog">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                Email
              </label>
              <div className={`${inputWrap} mt-2`}>
                <input
                  id="book-email"
                  name="email"
                  type="email"
                  required
                  defaultValue={user?.email ?? ''}
                  key={`email-${user?.id ?? 'guest'}`}
                  className={`${inputInner} min-h-[3.25rem]`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="book-phone" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-fog">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                Phone
              </label>
              <div className={`${inputWrap} mt-2`}>
                <input
                  id="book-phone"
                  name="phone"
                  type="tel"
                  required
                  className={`${inputInner} min-h-[3.25rem]`}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="book-budget" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-fog">
              <Wallet className="h-3.5 w-3.5" aria-hidden />
              Budget range
            </label>
            <div className={`${inputWrap} mt-2`}>
              <input
                id="book-budget"
                name="budget"
                type="text"
                inputMode="text"
                required
                className={`${inputInner} min-h-[3.25rem]`}
              />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-fog/80">
              Helps us match your request. Final price is confirmed before we accept your booking.
            </p>
          </div>

          <div className="mt-5">
            <label htmlFor="book-notes" className="text-xs font-semibold tracking-wide text-fog">
              Notes (optional)
            </label>
            <div className={`${inputWrap} mt-2`}>
              <textarea
                id="book-notes"
                name="notes"
                rows={3}
                placeholder="Bedrooms, pets, access instructions…"
                className={`${inputInner} resize-y py-3`}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting || loadingAvail || !availability?.available}
            whileTap={{ scale: 0.98 }}
            className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 text-sm font-semibold text-void shadow-lg shadow-black/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Booking…
              </>
            ) : (
              isSupabaseConfigured() ? 'Request quote & book' : 'Confirm booking'
            )}
          </motion.button>
          </form>
        </GlowBorder>
      </FadeContent>
    </div>
  )
}
