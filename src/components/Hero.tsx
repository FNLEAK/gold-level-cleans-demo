import { motion } from 'framer-motion'
import { ArrowRight, Home, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { heroHighlights, heroTagline, OWNER_NAME, PHONE_DISPLAY, PHONE_TEL } from '../data/siteContent'
import { BrandLogo } from './BrandLogo'
import { ShinyText } from './reactbits/ShinyText'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.03 },
  },
}

const easeOut = [0.22, 1, 0.36, 1] as const

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
}

const highlightIcons = {
  sparkles: Sparkles,
  home: Home,
  shield: ShieldCheck,
} as const

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-[max(1rem,env(safe-area-inset-left))] pb-6 pt-1 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-8 md:pt-2"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-6 h-[min(40vw,18rem)] w-[min(80vw,36rem)] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[100px] animate-gold-pulse"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={item} className="-mb-1 flex justify-center">
            <BrandLogo size="hero" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-3 font-display text-sm font-medium uppercase tracking-[0.2em] text-gold-400 sm:text-base"
          >
            <ShinyText text="Clean spaces. High standards." className="font-display font-medium uppercase" />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-fog sm:text-base md:text-lg"
          >
            {heroTagline} Owner-operated by {OWNER_NAME}.{' '}
            <a href={`tel:${PHONE_TEL}`} className="font-semibold text-gold-400 hover:text-gold-300">
              {PHONE_DISPLAY}
            </a>
          </motion.p>

          <motion.div
            variants={item}
            className="mt-6 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap"
          >
            <Link to="/book" className="btn-primary group flex-1 sm:flex-initial">
              Book online
              <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/services" className="btn-secondary flex-1 sm:flex-initial">
              View services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: easeOut }}
          className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-12 lg:grid-cols-3"
        >
          {heroHighlights.map((h, i) => {
            const Icon = highlightIcons[h.icon]
            return (
              <GlowBorder key={h.title} className="h-full">
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl bg-void-200/50 p-5 text-left backdrop-blur-sm transition sm:p-6 ${
                    i === 1 ? 'bg-gradient-to-br from-gold-muted/40 to-void-200/60 lg:-mt-2' : ''
                  }`}
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold-400/10 blur-2xl transition group-hover:bg-gold-400/15"
                    aria-hidden
                  />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-muted/70 text-gold-400 shadow-[0_0_24px_-10px_rgba(212,175,55,0.5)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="relative mt-4 font-display text-base font-semibold text-white sm:text-lg">
                    {h.title}
                  </p>
                  <p className="relative mt-2 font-sans text-xs leading-relaxed text-fog sm:text-sm">
                    {h.body}
                  </p>
                </div>
              </GlowBorder>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
