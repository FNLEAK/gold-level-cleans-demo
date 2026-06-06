import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Booking } from '../lib/api'
import { formatStartTime } from '../lib/supabase-bookings'

type OwnerCalendarProps = {
  bookings: Booking[]
  onSelectDate?: (iso: string) => void
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function OwnerCalendar({ bookings, onSelectDate }: OwnerCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of bookings) {
      if (b.status === 'cancelled') continue
      const list = map.get(b.date) ?? []
      list.push(b)
      map.set(b.date, list)
    }
    return map
  }, [bookings])

  const grid = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells: Array<{ iso: string; day: number } | null> = []
    for (let i = 0; i < startPad; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push({ iso, day: d })
    }
    return cells
  }, [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const todayIso = today.toISOString().slice(0, 10)

  return (
    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-void-200/40 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4 sm:px-6">
        <h2 className="font-display text-lg font-semibold text-white sm:text-xl">Schedule calendar</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-fog hover:text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[9rem] text-center text-sm font-medium text-mist">
            {monthLabel(viewYear, viewMonth)}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-fog hover:text-white"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px border-b border-white/[0.06] bg-white/[0.04] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-fog sm:px-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-2 sm:gap-1.5 sm:p-4">
        {grid.map((cell, i) => {
          if (!cell) {
            return <div key={`empty-${i}`} className="min-h-[3.25rem] sm:min-h-[4.5rem]" />
          }
          const dayBookings = byDate.get(cell.iso) ?? []
          const isToday = cell.iso === todayIso
          const hasPending = dayBookings.some((b) => b.status === 'pending')
          const hasConfirmed = dayBookings.some((b) => b.status === 'confirmed')

          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onSelectDate?.(cell.iso)}
              className={`flex min-h-[3.25rem] flex-col rounded-xl border p-1.5 text-left transition [touch-action:manipulation] sm:min-h-[4.5rem] sm:p-2 ${
                isToday
                  ? 'border-gold-400/40 bg-gold-muted/30'
                  : 'border-white/[0.06] bg-void-200/30 hover:border-gold-400/25'
              }`}
            >
              <span className={`text-xs font-semibold ${isToday ? 'text-gold-400' : 'text-mist'}`}>
                {cell.day}
              </span>
              {dayBookings.length > 0 ? (
                <div className="mt-1 space-y-0.5">
                  {dayBookings.slice(0, 2).map((b) => (
                    <span
                      key={b.id}
                      className={`block truncate rounded px-1 py-0.5 text-[9px] font-medium sm:text-[10px] ${
                        b.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-200'
                          : 'bg-gold-muted text-gold-300'
                      }`}
                      title={`${b.name}${b.startTime ? ` · ${formatStartTime(b.startTime)}` : ''}`}
                    >
                      {b.name.split(' ')[0]}
                    </span>
                  ))}
                  {dayBookings.length > 2 ? (
                    <span className="text-[9px] text-fog">+{dayBookings.length - 2}</span>
                  ) : null}
                </div>
              ) : null}
              <span className="mt-auto flex gap-0.5 pt-1">
                {hasPending ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
                ) : null}
                {hasConfirmed ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden />
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
