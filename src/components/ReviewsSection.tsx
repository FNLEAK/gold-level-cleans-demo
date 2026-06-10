import { MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { customerReviews } from '../data/reviews'
import { googleReviews } from '../data/siteContent'
import { FadeContent } from './reactbits/FadeContent'
import { ReviewsTitleCard } from './ReviewsTitleCard'

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? 'fill-gold-400 text-gold-400 drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]'
              : 'fill-white/10 text-white/10'
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review, index }: { review: (typeof customerReviews)[number]; index: number }) {
  return (
    <FadeContent delay={index * 0.05}>
      <GlowBorder className="h-full">
        <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-void-200/80 to-void-200/40 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <ReviewStars rating={review.rating} />
            <span className="text-[11px] font-medium uppercase tracking-wide text-fog/80">
              {review.date}
            </span>
          </div>
          <p className="mt-4 flex-1 text-[15px] leading-relaxed text-mist/95">{review.text}</p>
          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <p className="font-display text-base font-semibold text-white">{review.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-fog">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-400/70" aria-hidden />
              {review.location}
            </p>
            {review.service ? (
              <p className="mt-2 inline-flex rounded-full border border-gold-400/15 bg-gold-muted/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300">
                {review.service}
              </p>
            ) : null}
          </div>
        </article>
      </GlowBorder>
    </FadeContent>
  )
}

export function ReviewsSection() {
  const { profileUrl } = googleReviews

  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <ReviewsTitleCard />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:gap-6">
          {customerReviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>

        <FadeContent delay={0.15} className="mt-14">
          <GlowBorder className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-white/[0.06] bg-void-200/50 px-6 py-8 text-center sm:px-10 sm:py-10">
              <p className="font-display text-xl font-semibold text-white sm:text-2xl">
                Ready for a Gold Level clean?
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-fog sm:text-[15px]">
                Join homeowners across Central Indiana who trust us for deep, detail-driven cleans.
                {profileUrl
                  ? ' Book online or leave us a review on Google.'
                  : ' Book online today — Google reviews will appear here as our Business Profile goes live.'}
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link to="/book" className="btn-primary !min-h-11 w-full sm:w-auto">
                  Book your clean
                </Link>
                {profileUrl ? (
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !min-h-11 w-full sm:w-auto"
                  >
                    Leave a Google review
                  </a>
                ) : (
                  <Link to="/contact" className="btn-secondary !min-h-11 w-full sm:w-auto">
                    Contact us
                  </Link>
                )}
              </div>
            </div>
          </GlowBorder>
        </FadeContent>
      </div>
    </section>
  )
}
