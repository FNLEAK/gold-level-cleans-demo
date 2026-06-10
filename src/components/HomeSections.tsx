import { motion } from 'framer-motion'
import { ArrowRight, Calendar, ShieldCheck, Sparkles, Star, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { homeProcessSteps, homeTrustStats, OWNER_NAME } from '../data/siteContent'
import { AnimatedStatValue } from './AnimatedStatValue'
import { FadeContent } from './reactbits/FadeContent'

const easeOut = [0.22, 1, 0.36, 1] as const

const trustIcons = [Calendar, ShieldCheck, Home, Star] as const

const mobileScrollRow =
  '-mx-[max(1rem,env(safe-area-inset-left))] flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[max(1rem,env(safe-area-inset-left))] pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden'

export function HomeSections() {
  return (
    <>
      {/* Trust strip — compact 2×2 on phone */}
      <section className="border-y border-white/[0.06] bg-void-100/40 px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {homeTrustStats.map((stat, i) => {
            const Icon = trustIcons[i] ?? Sparkles
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-void-200/45 p-3.5 sm:p-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-center"
              >
                <div className="flex items-center gap-2 lg:block">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold-400/25 bg-gold-muted/80 text-gold-400 lg:mx-auto lg:mb-2 lg:h-10 lg:w-10 lg:rounded-xl">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  </span>
                  <p className="font-display text-xl font-bold leading-none text-gold-400 sm:text-2xl lg:text-4xl">
                    <AnimatedStatValue
                      value={stat.value}
                      countTo={'countTo' in stat ? stat.countTo : undefined}
                      suffix={'suffix' in stat ? stat.suffix : undefined}
                      delay={i * 0.08}
                    />
                  </p>
                </div>
                <p className="mt-2 text-[11px] font-semibold leading-snug text-white sm:text-sm lg:mt-2">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-fog sm:text-xs">{stat.sub}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-[max(1rem,env(safe-area-inset-left))] py-8 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-16">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.04] blur-[80px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <FadeContent className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400 sm:text-[11px] sm:tracking-[0.2em]">
              Simple process
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-white sm:mt-3 sm:text-4xl">
              How Gold Level works
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-fog sm:mt-4 sm:text-base">
              Book online, we deep clean, you walk in amazed.
            </p>
          </FadeContent>

          <div className="relative mt-6 sm:mt-10 md:mt-12">
            <div className={`${mobileScrollRow} md:grid md:grid-cols-3 md:gap-8`}>
              {homeProcessSteps.map((step, i) => (
                <FadeContent
                  key={step.step}
                  delay={i * 0.05}
                  className="h-full w-[min(78vw,17.5rem)] shrink-0 snap-center sm:w-auto md:shrink"
                >
                  <GlowBorder className="h-full">
                    <article className="relative flex h-full min-h-[11rem] flex-col bg-void-200 p-4 backdrop-blur-sm sm:min-h-0 sm:p-6 md:p-8">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/30 bg-gold-muted font-display text-xs font-bold text-gold-400 sm:h-10 sm:w-10 sm:text-sm">
                        {step.step}
                      </span>
                      <h3 className="mt-3 font-display text-base font-semibold text-white sm:mt-5 sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-fog sm:mt-3 sm:text-sm">
                        {step.body}
                      </p>
                    </article>
                  </GlowBorder>
                </FadeContent>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-fog/80 sm:hidden">Swipe for steps →</p>
          </div>

          <FadeContent delay={0.1} className="mt-6 flex justify-center sm:mt-10">
            <Link to="/book" className="btn-primary group w-full max-w-sm !min-h-12 sm:w-auto sm:max-w-none">
              Start with a booking
              <Calendar className="h-4 w-4" />
            </Link>
          </FadeContent>
        </div>
      </section>

      {/* Owner + CTA */}
      <section className="px-[max(1rem,env(safe-area-inset-left))] pb-10 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-16">
        <GlowBorder className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-muted/40 via-void-200/90 to-void-200/60 p-5 text-center shadow-[0_32px_80px_-32px_rgba(212,175,55,0.25)] sm:p-10 md:p-14"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.12),transparent_50%)]"
              aria-hidden
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-black/20 px-3 py-1 text-[11px] font-semibold text-gold-400 sm:px-4 sm:py-1.5 sm:text-xs">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Ready when you are
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold text-white sm:mt-6 sm:text-4xl">
                Your home deserves Gold Level care
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-fog sm:mt-4 sm:text-base">
                {OWNER_NAME} personally oversees every deep clean. Book online or reach out for a
                custom quote.
              </p>
              <div className="mt-6 flex flex-col items-stretch gap-2.5 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3">
                <Link to="/book" className="btn-primary group w-full sm:w-auto">
                  Book your deep clean
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link to="/contact" className="btn-secondary w-full sm:w-auto">
                  Request a quote
                </Link>
              </div>
            </div>
          </motion.div>
        </GlowBorder>
      </section>
    </>
  )
}
