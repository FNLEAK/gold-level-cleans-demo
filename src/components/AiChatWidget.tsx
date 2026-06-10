import { AnimatePresence, motion } from 'framer-motion'
import {
  MessageCircle,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBotReply } from '../data/chatResponses'
import { BUSINESS_NAME, PHONE_DISPLAY } from '../data/siteContent'

type Role = 'user' | 'bot'

type ChatMessage = {
  id: string
  role: Role
  text: string
}

type BookingStep = 'name' | 'email' | 'time' | 'notes'

type BookingDraft = {
  name: string
  email: string
  time: string
  notes: string
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

function wantsBooking(text: string) {
  return /\b(book|booking|schedule|appointment|reserve|sign up|sign me up)\b/i.test(
    text,
  )
}

const initialBot =
  'Hi! I can help with pricing, deep clean details, booking, or contact info. Try "How much for a 2 bedroom?" or tap a shortcut below.'

export function AiChatWidget() {
  const navigate = useNavigate()
  const panelId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bookingRef = useRef<BookingDraft>({
    name: '',
    email: '',
    time: '',
    notes: '',
  })

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: uid(), role: 'bot', text: initialBot },
  ])
  const [bookingStep, setBookingStep] = useState<BookingStep | null>(null)

  const scrollToBottom = useCallback(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, open, scrollToBottom])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 200)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const pushBot = useCallback((text: string) => {
    setMessages((m) => [...m, { id: uid(), role: 'bot', text }])
  }, [])

  const pushUser = useCallback((text: string) => {
    setMessages((m) => [...m, { id: uid(), role: 'user', text }])
  }, [])

  const finishBooking = useCallback(
    (complete: BookingDraft) => {
      const body = [
        'Booking request (via GLC Assistant)',
        `Name: ${complete.name}`,
        `Email: ${complete.email}`,
        `Preferred time: ${complete.time}`,
        `Notes: ${complete.notes}`,
      ].join('\n')
      const q = new URLSearchParams({
        fullname: complete.name,
        email: complete.email,
        message: body,
      })
      pushBot(
        'Opening the contact form with your details filled in. Review and tap SUBMIT to send.',
      )
      setBookingStep(null)
      setOpen(false)
      navigate(`/contact?${q.toString()}`)
    },
    [navigate, pushBot],
  )

  const startBooking = useCallback(() => {
    bookingRef.current = { name: '', email: '', time: '', notes: '' }
    setBookingStep('name')
    pushBot("Great! Let's book you in. What's your full name?")
  }, [pushBot])

  const handleBookingLine = useCallback(
    (line: string) => {
      const t = line.trim()
      if (!bookingStep) return false

      if (bookingStep === 'name') {
        bookingRef.current.name = t
        setBookingStep('email')
        pushBot('Thanks! What email should we use for confirmation?')
        return true
      }
      if (bookingStep === 'email') {
        if (!isValidEmail(t)) {
          pushBot(
            'That email doesn’t look quite right. Please include something like name@domain.com.',
          )
          return true
        }
        bookingRef.current.email = t.trim()
        setBookingStep('time')
        pushBot('Preferred day or time window? (e.g. “next Tuesday morning”)')
        return true
      }
      if (bookingStep === 'time') {
        bookingRef.current.time = t
        setBookingStep('notes')
        pushBot('Any notes for the crew? (home size, pets, add-ons, access instructions…)')
        return true
      }
      if (bookingStep === 'notes') {
        bookingRef.current.notes = t
        const done = { ...bookingRef.current }
        setBookingStep(null)
        finishBooking(done)
        return true
      }
      return false
    },
    [bookingStep, finishBooking, pushBot],
  )

  const send = useCallback(() => {
    const raw = input.trim()
    if (!raw) return
    setInput('')
    pushUser(raw)

    if (handleBookingLine(raw)) return

    if (wantsBooking(raw)) {
      startBooking()
      return
    }

    window.setTimeout(() => {
      pushBot(getBotReply(raw))
    }, 380)
  }, [handleBookingLine, input, pushBot, pushUser, startBooking])

  return (
    <div className="pointer-events-none fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-[200] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="GLC Assistant chat"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="pointer-events-auto flex max-h-[min(72dvh,560px)] w-[min(calc(100vw-1.5rem),380px)] max-w-[calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-1rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-void-200 to-void shadow-2xl shadow-black/50 ring-1 ring-zinc-800"
          >
            <div className="flex items-start justify-between gap-2 border-b border-gold-400/20 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold-400/25 bg-gradient-to-br from-void-100 to-void-200 p-1 shadow-md shadow-black/30 ring-1 ring-gold-400/10">
                  <img
                    src="/logo-96.webp"
                    alt=""
                    className="h-[1.65rem] w-[1.65rem] object-contain object-top"
                    aria-hidden
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-white">
                    GLC Assistant
                  </p>
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400/80">
                    {BUSINESS_NAME}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-fog transition hover:bg-void-300 hover:text-mist [touch-action:manipulation]"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={listRef}
              aria-live="polite"
              aria-relevant="additions"
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[92%] rounded-2xl rounded-br-md bg-gold-400 px-3.5 py-2.5 text-left text-[13px] leading-relaxed text-void shadow-md'
                        : 'max-w-[92%] rounded-2xl rounded-bl-md border border-white/10 bg-void-200/60 px-3.5 py-2.5 text-left text-[13px] leading-relaxed text-mist'
                    }
                  >
                    {m.text.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-gold-400/20 px-3 py-2.5">
              <button
                type="button"
                className="min-h-10 shrink-0 rounded-full border border-white/10 bg-void-200/60 px-3.5 py-2 text-left text-xs font-medium text-mist transition hover:bg-void-300 [touch-action:manipulation]"
                onClick={() => {
                  pushUser('Services')
                  pushBot('Opening Services. Deep clean checklist and garage add-on details are there.')
                  setOpen(false)
                  navigate('/services')
                }}
              >
                Services
              </button>
              <button
                type="button"
                className="min-h-10 shrink-0 rounded-full border border-white/10 bg-void-200/60 px-3.5 py-2 text-left text-xs font-medium text-mist transition hover:bg-void-300 [touch-action:manipulation]"
                onClick={() => {
                  pushUser('Book online')
                  pushBot('Opening the booking page. Pick your date. We take up to 7 jobs per week.')
                  setOpen(false)
                  navigate('/book')
                }}
              >
                Book online
              </button>
              <button
                type="button"
                className="min-h-10 shrink-0 rounded-full border border-white/10 bg-void-200/60 px-3.5 py-2 text-left text-xs font-medium text-mist transition hover:bg-void-300 [touch-action:manipulation]"
                onClick={() => {
                  pushUser('Reviews')
                  pushBot('Opening Reviews. See what homeowners say about our deep cleans.')
                  setOpen(false)
                  navigate('/reviews')
                }}
              >
                Reviews
              </button>
              <button
                type="button"
                className="min-h-10 shrink-0 rounded-full border border-white/10 bg-void-200/60 px-3.5 py-2 text-left text-xs font-medium text-mist transition hover:bg-void-300 [touch-action:manipulation]"
                onClick={() => {
                  pushUser('About')
                  pushBot('Opening About. Our story and philosophy are on that page.')
                  setOpen(false)
                  navigate('/about')
                }}
              >
                About
              </button>
              <button
                type="button"
                className="min-h-10 shrink-0 rounded-full border border-white/10 bg-void-200/60 px-3.5 py-2 text-left text-xs font-medium text-mist transition hover:bg-void-300 [touch-action:manipulation]"
                onClick={() => {
                  pushUser('Contact')
                  pushBot(`Opening Contact, or call ${PHONE_DISPLAY} for the fastest reply.`)
                  setOpen(false)
                  navigate('/contact')
                }}
              >
                Contact
              </button>
            </div>

            <div className="flex items-center gap-2 border-t border-gold-400/20 bg-void-200/80 px-2 py-2">
              <MessageCircle className="h-4 w-4 shrink-0 text-gold-400/70" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Ask anything or type “book”…"
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-void-200/60 px-3 py-2.5 text-base text-white outline-none placeholder:text-fog/80 focus:border-gold-400/45 focus:ring-1 focus:ring-gold-400/20"
                aria-label="Message to GLC Assistant"
              />
              <button
                type="button"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 text-void shadow-md transition hover:brightness-110 active:brightness-95 [touch-action:manipulation]"
                aria-label="Send message"
                onClick={send}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        layout
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open GLC Assistant"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-void-200/95 text-gold-400 shadow-lg shadow-black/45 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-gold-400/55 hover:shadow-[0_0_28px_-6px_rgba(212,175,55,0.5)] [touch-action:manipulation] sm:h-14 sm:w-14"
      >
        <Sparkles className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" aria-hidden />
      </motion.button>
    </div>
  )
}
