type GoldStreakLineProps = {
  className?: string
  /** Seconds for one full sweep */
  duration?: number
  /** Stagger start (seconds) */
  delay?: number
  /** Narrow gap segment between cards — tighter glow, clipped sweep */
  compact?: boolean
  /** Wider traveling highlight (e.g. full-width nav border) */
  wide?: boolean
}

export function GoldStreakLine({
  className = '',
  duration = 3.5,
  delay = 0,
  compact = false,
  wide = false,
}: GoldStreakLineProps) {
  const streakWidth = compact
    ? 'w-full'
    : wide
      ? 'w-[min(18rem,42%)]'
      : 'w-[min(7rem,18%)]'

  return (
    <div
      className={`pointer-events-none absolute h-px overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div
          className={`absolute top-0 h-full animate-gold-streak-sweep ${streakWidth}`}
          style={{
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.2) 18%, #bf953f 35%, #fcf6ba 48%, #d4af37 52%, #f9e29c 62%, #b38728 78%, rgba(212,175,55,0.15) 92%, transparent 100%)',
            boxShadow: compact
              ? '0 0 6px rgba(212, 175, 55, 0.45)'
              : '0 0 14px rgba(212, 175, 55, 0.5), 0 0 3px rgba(252, 246, 186, 0.75)',
          }}
        />
      </div>
    </div>
  )
}

/** Gold streaks aligned to grid gaps only (not behind cards). */
export function GoldStreakConnectors({
  className = '',
  duration = 3.5,
}: {
  className?: string
  duration?: number
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 grid grid-cols-3 gap-8 ${className}`}
      aria-hidden
    >
      <div className="relative">
        <GoldStreakLine compact duration={duration} className="absolute left-full top-0 h-px w-8" />
      </div>
      <div className="relative">
        <GoldStreakLine
          compact
          duration={duration}
          delay={duration * 0.35}
          className="absolute left-full top-0 h-px w-8"
        />
      </div>
      <div />
    </div>
  )
}
