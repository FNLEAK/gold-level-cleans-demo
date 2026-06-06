import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowBorder } from '@/components/ui/spotlight-card'
import {
  aboutParagraphs,
  aboutYouHeading,
  aboutYouLines,
  BRAND_TAGLINE,
  BUSINESS_NAME,
  callTodayHeading,
  homeTrustStats,
  OWNER_NAME,
  OWNER_HEADSHOT_ALT,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_COUNTIES,
} from '../data/siteContent'
import { FadeContent } from './reactbits/FadeContent'
import { ShinyText } from './reactbits/ShinyText'

const easeOut = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

const careIcons = [Sparkles, Home, ShieldCheck, Calendar] as const

export function AboutSection() {
  return (
    <section className="relative overflow-hidden px-[max(1rem,env(safe-area-inset-left))] pb-16 pt-6 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-24 md:pt-8">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[min(100%,52rem)] -translate-x-1/2 rounded-full bg-gold-400/[0.08] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-64 w-64 rounded-full bg-gold-500/[0.04] blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-56 w-56 rounded-full bg-gold-400/[0.05] blur-[80px]"
        aria-hidden
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl"
      >
        {/* Hero panel */}
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-gold-muted/35 via-void-200/95 to-void-200/60 p-5 shadow-[0_32px_100px_-32px_rgba(212,175,55,0.2)] backdrop-blur-xl sm:p-8 md:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,175,55,0.14),transparent_45%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.035]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg,#d4af37 0,#d4af37 1px,transparent 1px,transparent 56px)',
            }}
            aria-hidden
          />

          <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <div className="relative h-36 w-28 overflow-hidden rounded-2xl bg-void-200 shadow-[0_0_48px_-8px_rgba(212,175,55,0.55)] ring-2 ring-gold-400/40 ring-offset-2 ring-offset-void-200 sm:h-44 sm:w-36 sm:rounded-3xl">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="/mykala-288.webp 288w, /mykala-576.webp 576w"
                      sizes="(max-width: 640px) 112px, 144px"
                    />
                    <img
                      src="/mykala-288.webp"
                      alt={OWNER_HEADSHOT_ALT}
                      width={144}
                      height={176}
                      className="h-full w-full object-cover object-[center_18%]"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-void-200 bg-gold-400 text-void shadow-lg">
                  <Star className="h-4 w-4 fill-void" aria-hidden />
                </span>
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">
                About us
              </p>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                Meet{' '}
                <ShinyText text={OWNER_NAME} className="font-display font-semibold" speed={6} />
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fog sm:text-lg lg:mx-0">
                Owner-operated deep cleaning with a gold standard checklist on every visit. Real
                accountability, real results, every time you walk through the door.
              </p>
              <div className="mt-5 flex flex-col items-stretch gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/25 bg-black/25 px-4 py-2.5 text-xs font-semibold text-gold-400 backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  100% owner-operated
                </span>
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-void-200/50 px-4 py-2.5 text-center text-xs font-medium leading-snug text-fog">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-400/80" aria-hidden />
                  <span className="text-balance">{SERVICE_COUNTIES}</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div variants={item} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {homeTrustStats.map((stat, i) => (
            <FadeContent key={stat.label} delay={i * 0.04}>
              <div className="rounded-2xl border border-white/[0.07] bg-void-200/45 p-5 text-center backdrop-blur-sm transition hover:border-gold-400/25 sm:p-6">
                <p className="font-display text-2xl font-bold text-gold-400 sm:text-3xl">{stat.value}</p>
                <p className="mt-1.5 text-sm font-semibold text-white">{stat.label}</p>
                <p className="mt-1 text-xs text-fog">{stat.sub}</p>
              </div>
            </FadeContent>
          ))}
        </motion.div>

        {/* Story + care panel */}
        <motion.div variants={item} className="mt-8 grid gap-6 lg:grid-cols-5 lg:items-stretch lg:gap-6">
          <div className="lg:flex lg:col-span-3">
            <GlowBorder className="w-full lg:flex lg:h-full lg:flex-1 lg:flex-col">
              <div className="flex flex-col rounded-2xl bg-void-200/55 p-5 backdrop-blur-sm sm:p-7 lg:h-full lg:flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  Our story
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
                  Built on detail, not shortcuts
                </h2>
                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-fog sm:text-base">
                  {aboutParagraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
                <div className="mt-6 mobile-stack pt-2 lg:mt-auto lg:pt-6">
                  <Link to="/book" className="btn-primary group !min-h-11 !px-6 !text-sm">
                    Book a deep clean
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                  <Link to="/services" className="btn-secondary !min-h-11 !px-6 !text-sm">
                    View services
                  </Link>
                </div>
              </div>
            </GlowBorder>
          </div>

          <div className="lg:flex lg:col-span-2">
            <GlowBorder className="w-full lg:flex lg:h-full lg:flex-1 lg:flex-col">
              <div className="flex flex-col rounded-2xl bg-gradient-to-br from-gold-muted/25 via-void-200/70 to-void-200/50 p-5 backdrop-blur-sm sm:p-7 lg:h-full lg:flex-1">
                <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {aboutYouHeading}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {aboutYouLines.map((line, i) => {
                    const Icon = careIcons[i] ?? CheckCircle2
                    return (
                      <li
                        key={line}
                        className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-3 transition hover:border-gold-400/20"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold-400/20 bg-gold-muted/70 text-gold-400">
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <span className="text-sm leading-relaxed text-fog">{line}</span>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-6 border-t border-white/[0.08] pt-5 lg:mt-auto">
                  <p className="font-display text-base font-semibold text-white sm:text-lg">
                    {callTodayHeading}
                  </p>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="mt-3 inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-void shadow-[0_0_32px_-8px_rgba(212,175,55,0.55)] transition hover:brightness-110 sm:w-auto [touch-action:manipulation]"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </GlowBorder>
          </div>
        </motion.div>

        {/* Values row */}
        <motion.div variants={item} className="mt-8">
          <FadeContent className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              Why Gold Level
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
              The standard we hold ourselves to
            </h2>
          </FadeContent>
          <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Quality over volume',
                body: 'We cap at 7 deep cleans per week so every home gets full attention, not a rushed pass.',
                icon: Sparkles,
              },
              {
                title: 'Custom to your home',
                body: 'Layout, size, and condition all matter. You get a quote tailored to your space before we arrive.',
                icon: Home,
              },
              {
                title: 'Counties we serve',
                body: `Proudly serving ${SERVICE_COUNTIES}. Contact us if you are nearby and not sure we cover your area.`,
                icon: MapPin,
              },
            ].map((card, i) => (
              <FadeContent key={card.title} delay={i * 0.06}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-void-200/40 p-6 backdrop-blur-sm transition hover:border-gold-400/25 sm:p-7">
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold-400/10 blur-2xl transition group-hover:bg-gold-400/15"
                    aria-hidden
                  />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-muted/70 text-gold-400">
                    <card.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="relative mt-4 font-display text-lg font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-fog">{card.body}</p>
                </div>
              </FadeContent>
            ))}
          </div>
        </motion.div>

        {/* Brand close */}
        <motion.div variants={item} className="mt-10">
          <GlowBorder className="mx-auto max-w-3xl">
            <div className="rounded-3xl bg-gradient-to-br from-gold-muted/30 via-void-200/90 to-void-200/60 px-6 py-8 text-center sm:px-10 sm:py-10">
              <p className="font-display text-2xl font-semibold sm:text-4xl">
                <ShinyText text={BUSINESS_NAME} className="font-display font-semibold" speed={5} />
              </p>
              <p className="mt-3 text-sm text-fog sm:text-base">{BRAND_TAGLINE}</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-fog/90">
                Premium deep cleaning, every time.
              </p>
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
                <Link to="/book" className="btn-primary group w-full sm:w-auto">
                  Schedule your clean
                  <Calendar className="h-4 w-4" />
                </Link>
                <Link to="/portfolio" className="btn-secondary w-full sm:w-auto">
                  See our work
                </Link>
              </div>
            </div>
          </GlowBorder>
        </motion.div>
      </motion.div>
    </section>
  )
}
