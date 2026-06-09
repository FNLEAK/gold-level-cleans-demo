import { motion } from 'framer-motion'
import { Mail, MessageSquare, Phone, Send, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  BUSINESS_NAME,
  contactCallHeading,
  contactHeading,
  EMAIL,
  OWNER_NAME,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '../data/siteContent'
import { BrandLogo } from './BrandLogo'
import { PageHeader } from './PageHeader'

const easeOut = [0.22, 1, 0.36, 1] as const

const inputWrap =
  'relative rounded-2xl border border-white/10 bg-void-200/60 shadow-sm transition focus-within:border-gold-400/45 focus-within:ring-2 focus-within:ring-gold-400/15'

const inputInner =
  'w-full rounded-2xl bg-transparent px-4 py-3.5 font-sans text-base leading-normal text-white outline-none placeholder:text-fog/80'

function decodeParam(v: string | null) {
  if (!v) return ''
  try {
    return decodeURIComponent(v.replace(/\+/g, ' '))
  } catch {
    return v
  }
}

export function ContactForm() {
  const [searchParams] = useSearchParams()
  const preset = useMemo(
    () => ({
      fullname: decodeParam(searchParams.get('fullname')),
      email: decodeParam(searchParams.get('email')),
      message: decodeParam(searchParams.get('message')),
    }),
    [searchParams],
  )
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] pb-[max(5rem,env(safe-area-inset-bottom))] pt-10 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-28 md:pt-14">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow={contactHeading}
          title={contactCallHeading}
          subtitle={`Call ${PHONE_DISPLAY} or email ${EMAIL}, or send a message below.`}
          className="mb-12"
        />

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5 lg:gap-10">
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="flex flex-col justify-between rounded-3xl border border-gold-400/20 bg-void-200/60 p-7 text-mist shadow-xl shadow-black/30 lg:col-span-2"
          >
            <div>
              <BrandLogo compact />
              <p className="mt-3 font-display text-lg font-semibold text-white">
                {BUSINESS_NAME}
              </p>
              <p className="mt-1 text-sm text-fog">Owner: {OWNER_NAME}</p>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                Custom quotes for every home. Garage add-ons typically $80–$120 depending on size.
                Book online or send a message — share your budget and we&apos;ll confirm pricing before
                your clean.
              </p>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gold-muted px-4 py-3 text-sm font-semibold text-gold-400 ring-1 ring-gold-400/25 transition hover:bg-gold-400/25 [touch-action:manipulation]"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-void-300/80 px-4 py-3 text-sm font-medium text-mist ring-1 ring-white/10 transition hover:bg-void-300 [touch-action:manipulation]"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                Email us
              </a>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: easeOut }}
            className="rounded-3xl border border-gold-400/20 bg-void-200/60 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8 lg:col-span-3"
          >
            {sent ? (
              <p className="rounded-2xl border border-gold-400/25 bg-gold-muted px-5 py-10 text-center text-mist">
                Thank you. This is a demo. Connect your form endpoint to deliver
                messages to your inbox or CRM.
              </p>
            ) : (
              <form
                key={`${preset.fullname}|${preset.email}|${preset.message}`}
                onSubmit={onSubmit}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="cf-name"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fog"
                  >
                    <User className="h-3.5 w-3.5" aria-hidden />
                    Full Name
                  </label>
                  <div className={`${inputWrap} mt-2`}>
                    <input
                      id="cf-name"
                      name="fullname"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Jane Doe"
                      defaultValue={preset.fullname}
                      className={`${inputInner} min-h-[3.25rem]`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cf-email"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fog"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    E-mail
                  </label>
                  <div className={`${inputWrap} mt-2`}>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      defaultValue={preset.email}
                      className={`${inputInner} min-h-[3.25rem]`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cf-msg"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fog"
                  >
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                    Message
                  </label>
                  <div className={`${inputWrap} mt-2`}>
                    <textarea
                      id="cf-msg"
                      name="message"
                      rows={5}
                      required
                      placeholder="Bedrooms, square footage, garage add-on, preferred date…"
                      defaultValue={preset.message}
                      className={`${inputInner} min-h-[11rem] resize-y py-3`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 text-sm font-bold uppercase tracking-[0.12em] text-void shadow-lg shadow-black/30 transition hover:brightness-110 active:brightness-95 [touch-action:manipulation]"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  SUBMIT
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
