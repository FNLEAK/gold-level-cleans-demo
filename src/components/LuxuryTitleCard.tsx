import { motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { ShinyText } from './reactbits/ShinyText'

const easeOut = [0.22, 1, 0.36, 1] as const
const titleClass =
  'font-display text-[clamp(1.85rem,5.5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight'

type LuxuryTitleCardProps = {
  eyebrow: string
  titleLead: string
  titleHighlight: string
  subtitle: string
  tags?: string[]
  accentIcon?: 'sparkles' | 'star'
}

function CornerAccent({ className }: { className: string }) {
  return (
    <span
      className={`pointer-events-none absolute h-10 w-10 border-gold-400/35 ${className}`}
      aria-hidden
    />
  )
}

export function LuxuryTitleCard({
  eyebrow,
  titleLead,
  titleHighlight,
  subtitle,
  tags = [],
  accentIcon = 'sparkles',
}: LuxuryTitleCardProps) {
  const AccentIcon = accentIcon === 'star' ? Star : Sparkles
  const accentIconClass =
    accentIcon === 'star'
      ? 'h-3.5 w-3.5 shrink-0 fill-gold-400/20 text-gold-400/80'
      : 'h-3.5 w-3.5 shrink-0 text-gold-400/80'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easeOut }}
      className="relative mx-auto max-w-4xl"
    >
      <div
        className="pointer-events-none absolute -inset-x-8 top-1/2 h-48 -translate-y-1/2 rounded-full bg-gold-400/[0.07] blur-[80px] animate-gold-pulse"
        aria-hidden
      />

      <GlowBorder className="overflow-hidden rounded-[1.75rem]">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-b from-void-200/95 via-[#0c0c0c]/90 to-void-100/85 px-6 py-10 text-center backdrop-blur-md sm:px-10 sm:py-12 md:px-14 md:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.14), transparent 52%), radial-gradient(circle at 0% 100%, rgba(184,134,11,0.06), transparent 40%), radial-gradient(circle at 100% 100%, rgba(201,162,39,0.06), transparent 40%)',
            }}
            aria-hidden
          />

          <CornerAccent className="left-5 top-5 border-l border-t sm:left-7 sm:top-7" />
          <CornerAccent className="right-5 top-5 border-r border-t sm:right-7 sm:top-7" />
          <CornerAccent className="bottom-5 left-5 border-b border-l sm:bottom-7 sm:left-7" />
          <CornerAccent className="bottom-5 right-5 border-b border-r sm:bottom-7 sm:right-7" />

          <div className="relative flex items-center justify-center gap-3 sm:gap-4">
            <span
              className="hidden h-px w-10 bg-gradient-to-r from-transparent via-gold-400/50 to-gold-400/20 sm:block sm:w-16 md:w-24"
              aria-hidden
            />
            <AccentIcon className={accentIconClass} aria-hidden />
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] sm:text-xs sm:tracking-[0.32em]">
              <ShinyText text={eyebrow} className="font-display font-semibold uppercase" />
            </p>
            <AccentIcon className={accentIconClass} aria-hidden />
            <span
              className="hidden h-px w-10 bg-gradient-to-l from-transparent via-gold-400/50 to-gold-400/20 sm:block sm:w-16 md:w-24"
              aria-hidden
            />
          </div>

          <h1 className={`relative mt-6 text-balance text-white sm:mt-7 ${titleClass}`}>
            {titleLead}{' '}
            <span className="relative inline-block">
              <ShinyText text={titleHighlight} className={titleClass} speed={4.5} />
            </span>
          </h1>

          <div className="mx-auto mt-5 flex w-fit items-center gap-3 sm:mt-6" aria-hidden>
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/45 sm:w-12" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-400/70 shadow-[0_0_10px_rgba(212,175,55,0.55)]" />
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/45 sm:w-12" />
          </div>

          <p className="relative mx-auto mt-5 max-w-2xl text-balance font-sans text-[15px] leading-relaxed text-fog/95 sm:mt-6 sm:text-base md:text-[17px] md:leading-[1.7]">
            {subtitle}
          </p>

          {tags.length > 0 ? (
            <ul className="relative mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-9 sm:gap-2.5">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-gold-400/20 bg-gold-muted/80 px-3.5 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-300 backdrop-blur-sm sm:text-[11px] sm:tracking-[0.18em]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </GlowBorder>
    </motion.div>
  )
}
