import { motion } from 'framer-motion'
import { ArrowRight, Home, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { heroHighlights, heroTagline, OWNER_NAME, PHONE_DISPLAY, PHONE_TEL } from '../data/siteContent'
import { BrandLogo } from './BrandLogo'
import { GoogleReviewsBadge } from './GoogleReviewsBadge'
import { ShinyText } from './reactbits/ShinyText'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
}

const easeOut = [0.22, 1, 0.36, 1] as const

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
}

const highlightIcons = {
  sparkles: Sparkles,
  home: Home,
  shield: ShieldCheck,
} as const

const mobileScrollRow =
  '-mx-[max(1rem,env(safe-area-inset-left))] flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[max(1rem,env(safe-area-inset-left))] pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-1 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden'

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-[max(1rem,env(safe-area-inset-left))] pb-4 pt-0 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-8 md:pt-2"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-4 h-[min(36vw,14rem)] w-[min(75vw,32rem)] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[100px] animate-gold-pulse"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={item} className="flex justify-center">
            <BrandLogo size="hero" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-2 font-display text-xs font-medium uppercase tracking-[0.16em] text-gold-400 sm:mt-3 sm:text-base sm:tracking-[0.2em]"
          >
            <ShinyText text="Clean spaces. High standards." className="font-display font-medium uppercase" />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-3 max-w-md font-sans text-sm leading-relaxed text-fog sm:mt-4 sm:max-w-xl sm:text-base md:text-lg"
          >
            {heroTagline} Owner-operated by {OWNER_NAME}.{' '}
            <a
              href={`tel:${PHONE_TEL}`}
              className="font-semibold text-gold-400 hover:text-gold-300 [touch-action:manipulation]"
            >
              {PHONE_DISPLAY}
            </a>
          </motion.p>

          <motion.div variants={item} className="mt-5 flex w-full max-w-sm flex-col gap-2.5 sm:mt-6 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3">
            <Link to="/book" className="btn-primary group w-full sm:w-auto">
              Book online
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/services" className="btn-secondary w-full sm:w-auto">
              View services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: easeOut }}
          className="mx-auto mt-7 flex w-full max-w-xl justify-center px-1 sm:mt-8"
        >
          <GoogleReviewsBadge variant="hero" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45, ease: easeOut }}
          className="mx-auto mt-7 max-w-5xl sm:mt-9"
        >
          <div className={mobileScrollRow}>
            {heroHighlights.map((h, i) => {
              const Icon = highlightIcons[h.icon]
              return (
                <GlowBorder key={h.title} className="h-full w-[min(80vw,17rem)] shrink-0 snap-center sm:w-auto lg:shrink">
                  <div
                    className={`group relative flex h-full min-h-[9.5rem] flex-col bg-void-200/50 p-4 text-left backdrop-blur-sm sm:min-h-0 sm:p-6 ${
                      i === 1 ? 'bg-gradient-to-br from-gold-muted/40 to-void-200/60' : ''
                    }`}
                  >
                    <div
                      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold-400/10 blur-2xl transition group-hover:bg-gold-400/15"
                      aria-hidden
                    />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-muted/70 text-gold-400">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="relative mt-3 font-display text-sm font-semibold text-white sm:mt-4 sm:text-lg">
                      {h.title}
                    </p>
                    <p className="relative mt-1.5 flex-1 font-sans text-xs leading-relaxed text-fog sm:mt-2 sm:text-sm">
                      {h.body}
                    </p>
                  </div>
                </GlowBorder>
              )
            })}
          </div>
          <p className="mt-2 text-center text-[10px] text-fog/80 sm:hidden">Swipe to explore →</p>
        </motion.div>
      </div>
    </section>
  )
}
