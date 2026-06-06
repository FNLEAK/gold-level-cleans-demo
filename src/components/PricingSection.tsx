import { Link } from 'react-router-dom'
import { ArrowRight, Banknote, Car, Home, Sparkles } from 'lucide-react'
import {
  pricesSectionHeading,
  pricingNote,
  pricingTiers,
} from '../data/siteContent'
import { FadeContent } from './reactbits/FadeContent'
import { SpotlightCard } from './reactbits/SpotlightCard'
import { ShinyText } from './reactbits/ShinyText'

const tierIcons = {
  '1br': Home,
  '2br': Sparkles,
  full: Home,
  garage: Car,
} as const

type PricingSectionProps = {
  hideSectionTitle?: boolean
}

export function PricingSection({ hideSectionTitle = false }: PricingSectionProps) {
  return (
    <section className="relative px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        {!hideSectionTitle ? (
          <FadeContent className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-400">
              <Banknote className="h-4 w-4" aria-hidden />
              Price list
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight">
              {pricesSectionHeading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fog">{pricingNote}</p>
          </FadeContent>
        ) : null}

        <div
          className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-2 ${hideSectionTitle ? '' : 'mt-14'}`}
        >
          {pricingTiers.map((tier, i) => {
            const Icon = tierIcons[tier.id]
            return (
              <FadeContent key={tier.id} delay={i * 0.08}>
                <SpotlightCard
                  spotlightColor={
                    tier.featured
                      ? 'rgba(160, 217, 185, 0.15)'
                      : 'rgba(255, 255, 255, 0.04)'
                  }
                  className={`h-full rounded-2xl border bg-void-200/60 shadow-xl shadow-black/25 backdrop-blur-sm ${
                    tier.featured
                      ? 'border-gold-400/35 ring-1 ring-gold-400/20'
                      : 'border-gold-400/20'
                  } ${tier.addon ? 'border-dashed border-white/10' : ''}`}
                >
                  <article className="flex h-full flex-col p-7 sm:p-8">
                    {tier.featured ? (
                      <span className="mb-3 inline-flex w-fit rounded-full bg-gold-muted px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-400">
                        Most popular
                      </span>
                    ) : null}
                    {tier.addon ? (
                      <span className="mb-3 inline-flex w-fit rounded-full bg-void-300/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fog">
                        Add-on
                      </span>
                    ) : null}
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-muted text-gold-400 ring-1 ring-gold-400/20">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold text-white sm:text-2xl">
                      {tier.name}
                    </h3>
                    <p className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                      {tier.featured ? (
                        <ShinyText text={tier.price} className="font-display font-bold" />
                      ) : (
                        <span className="text-gold-400">{tier.price}</span>
                      )}
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-fog sm:text-[15px]">
                      {tier.description}
                    </p>
                  </article>
                </SpotlightCard>
              </FadeContent>
            )
          })}
        </div>

        <FadeContent delay={0.2} className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-fog">
            Every quote is personalized. Book online to share your details and optional budget — we
            confirm pricing before your clean is locked in.
          </p>
          <Link to="/book" className="btn-primary group shrink-0">
            Get your quote
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </FadeContent>
      </div>
    </section>
  )
}
