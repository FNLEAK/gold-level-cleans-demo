import { Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { googleReviews } from '../data/siteContent'

function GoogleMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'md' | 'lg' }) {
  const starClass = size === 'lg' ? 'h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]' : 'h-3.5 w-3.5 sm:h-4 sm:w-4'

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${starClass} ${
            i < rating
              ? 'fill-gold-400 text-gold-400 drop-shadow-[0_0_6px_rgba(212,175,55,0.45)]'
              : 'fill-white/10 text-white/10'
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

type GoogleReviewsBadgeProps = {
  className?: string
  variant?: 'default' | 'hero'
}

function ReviewShell({
  children,
  className,
  profileUrl,
  ariaLabel,
}: {
  children: ReactNode
  className: string
  profileUrl: string
  ariaLabel: string
}) {
  if (profileUrl) {
    return (
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} [touch-action:manipulation]`}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    )
  }

  return (
    <div className={className} aria-label={ariaLabel}>
      {children}
    </div>
  )
}

export function GoogleReviewsBadge({ className = '', variant = 'default' }: GoogleReviewsBadgeProps) {
  const { rating, reviewCount, profileUrl, label, headline } = googleReviews
  const ratingLabel = `${rating.toFixed(1)} out of 5 stars on Google`
  const countText =
    reviewCount != null && reviewCount > 0 ? `${reviewCount}+ reviews` : '5-star rated'

  if (variant === 'hero') {
    return (
      <ReviewShell
        profileUrl={profileUrl}
        ariaLabel={`${ratingLabel}. Read our ${label}.`}
        className={`group relative w-full max-w-md sm:max-w-xl ${className}`.trim()}
      >
        <div
          className="pointer-events-none absolute -inset-3 rounded-3xl bg-gold-400/[0.07] opacity-80 blur-2xl transition group-hover:opacity-100"
          aria-hidden
        />
        <div className="relative overflow-hidden rounded-2xl border border-gold-400/25 bg-gradient-to-br from-void-200/90 via-void-200/70 to-void-200/90 px-5 py-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md sm:px-6 sm:py-5">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"
            aria-hidden
          />
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] ring-1 ring-black/5 sm:h-[3.25rem] sm:w-[3.25rem]">
                <GoogleMark className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-fog/90">
                Google
              </span>
            </div>

            <div className="h-12 w-px shrink-0 bg-gradient-to-b from-transparent via-white/15 to-transparent sm:h-14" aria-hidden />

            <div className="min-w-0 flex-1 text-left">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="font-display text-3xl font-bold leading-none tracking-tight text-white sm:text-[2rem]">
                  {rating.toFixed(1)}
                </span>
                <StarRating rating={rating} size="lg" />
              </div>
              <p className="mt-2 text-sm font-semibold text-mist sm:text-[15px]">{label}</p>
              <p className="mt-0.5 text-xs text-fog sm:text-[13px]">
                <span className="font-medium text-gold-400">{countText}</span>
                {headline ? ` · ${headline}` : ''}
              </p>
            </div>
          </div>
        </div>
      </ReviewShell>
    )
  }

  const countLabel =
    reviewCount != null && reviewCount > 0
      ? `${rating.toFixed(1)} · ${reviewCount}+ ${label}`
      : `${rating.toFixed(1)} · ${label}`

  return (
    <ReviewShell
      profileUrl={profileUrl}
      ariaLabel={ratingLabel}
      className={`inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-void-200/35 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition hover:border-gold-400/25 hover:bg-void-200/50 ${className}`.trim()}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
        <GoogleMark className="h-4 w-4" />
      </span>
      <span className="min-w-0 text-left">
        <StarRating rating={rating} />
        <span className="mt-1 block text-[11px] font-medium tracking-wide text-fog sm:text-xs">
          <span className="font-semibold text-mist">{countLabel}</span>
        </span>
      </span>
    </ReviewShell>
  )
}
