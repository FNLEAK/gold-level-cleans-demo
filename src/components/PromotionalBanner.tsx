import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { promoBanner } from '../data/siteContent'

const marqueeItems = [
  { kind: 'headline' as const, text: promoBanner.headline },
  { kind: 'badge' as const, text: promoBanner.badge },
  { kind: 'subline' as const, text: promoBanner.subline },
  { kind: 'cta' as const, text: `${promoBanner.ctaLabel} →` },
]

function MarqueeItem({ kind, text }: (typeof marqueeItems)[number]) {
  if (kind === 'headline') {
    return (
      <span className="inline-flex items-center gap-2 font-display text-[13px] font-bold tracking-wide text-gold-300 sm:text-sm">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden />
        {text}
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden />
      </span>
    )
  }

  if (kind === 'badge') {
    return (
      <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300">
        {text}
      </span>
    )
  }

  if (kind === 'cta') {
    return <span className="text-[13px] font-semibold text-white sm:text-sm">{text}</span>
  }

  return <span className="text-[13px] text-white/75 sm:text-sm">{text}</span>
}

function MarqueeChunk({ items, prefix }: { items: typeof marqueeItems; prefix: string }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={`${prefix}-${item.kind}-${i}`} className="inline-flex shrink-0 items-center">
          <MarqueeItem {...item} />
          <span className="ml-8 text-gold-500/45 sm:ml-10" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </>
  )
}

function MarqueeTrack({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [halfRepeats, setHalfRepeats] = useState(4)

  useEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const update = () => {
      const containerWidth = container.clientWidth
      const segmentWidth = measure.scrollWidth
      if (!segmentWidth) return
      setHalfRepeats(Math.max(2, Math.ceil(containerWidth / segmentWidth) + 1))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(container)
    ro.observe(measure)
    return () => ro.disconnect()
  }, [containerRef])

  const half = Array.from({ length: halfRepeats }, (_, r) => (
    <MarqueeChunk key={`seg-${r}`} items={marqueeItems} prefix={`r${r}`} />
  ))

  return (
    <>
      <div
        ref={measureRef}
        className="pointer-events-none absolute left-0 top-0 flex w-max items-center gap-8 opacity-0 sm:gap-10"
        aria-hidden
      >
        <MarqueeChunk items={marqueeItems} prefix="measure" />
      </div>
      <div className="promo-marquee-track flex w-max items-center gap-8 pr-8 sm:gap-10">
        {half}
        {half}
      </div>
    </>
  )
}

export function PromotionalBanner() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  return (
    <aside
      aria-label="First cleaning promotion"
      className="relative overflow-hidden border-b border-gold-400/25 bg-[#080808] pt-[max(0px,env(safe-area-inset-top))]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold-400/[0.04] via-gold-400/[0.12] to-gold-400/[0.04]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-12 bg-gradient-to-r from-[#080808] to-transparent sm:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-20 bg-gradient-to-l from-[#080808] to-transparent sm:w-36"
        aria-hidden
      />

      <div className="promo-banner-static relative hidden items-center justify-center gap-3 px-4 py-2.5 text-center sm:gap-4 sm:py-3">
        <span className="font-display text-xs font-bold text-gold-300 sm:text-sm">{promoBanner.headline}</span>
        <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300">
          {promoBanner.badge}
        </span>
        <Link
          to={promoBanner.ctaTo}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gold-400 hover:text-gold-300"
        >
          {promoBanner.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div className="promo-banner-scroll relative flex items-center pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <div ref={marqueeRef} className="promo-marquee relative min-w-0 flex-1 overflow-hidden py-2.5 sm:py-3">
          <MarqueeTrack containerRef={marqueeRef} />
        </div>

        <Link
          to={promoBanner.ctaTo}
          className="relative z-10 ml-2 inline-flex shrink-0 items-center gap-1 rounded-full border border-gold-400/50 bg-gold-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-void shadow-[0_0_24px_-6px_rgba(212,175,55,0.75)] transition hover:bg-gold-300 hover:border-gold-300 sm:gap-1.5 sm:px-4 sm:text-xs"
        >
          {promoBanner.ctaLabel}
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
        </Link>
      </div>
    </aside>
  )
}
