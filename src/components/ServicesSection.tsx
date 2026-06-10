import type { LucideIcon } from 'lucide-react'
import { Banknote, Bath, Car, ChefHat, Home, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  deepCleanAllRooms,
  deepCleanBathroom,
  deepCleanBathroomHeading,
  deepCleanIncludesHeading,
  deepCleanKitchen,
  deepCleanKitchenHeading,
  garageAddonBody,
  garageAddonHeading,
  servicesPricingNote,
  servicesGuaranteedBody,
  servicesGuaranteedHeading,
} from '../data/siteContent'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { FadeContent } from './reactbits/FadeContent'
import { ServicesTitleCard } from './ServicesTitleCard'

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-sm leading-relaxed text-fog sm:text-[15px]">
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400/80 shadow-[0_0_8px_rgba(212,175,55,0.45)]"
            aria-hidden
          />
          {t}
        </li>
      ))}
    </ul>
  )
}

function HighlightCard({
  eyebrow,
  title,
  body,
  icon: Icon,
  delay = 0,
}: {
  eyebrow: string
  title: string
  body: string
  icon: LucideIcon
  delay?: number
}) {
  return (
    <FadeContent delay={delay}>
      <GlowBorder className="h-full">
        <article className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-void-200/95 via-void-200/75 to-gold-muted/15 p-6 sm:p-8">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"
            aria-hidden
          />
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-muted/50 text-gold-400 shadow-[0_0_20px_-8px_rgba(212,175,55,0.55)]">
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400/90">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-fog/95 sm:text-base">{body}</p>
        </article>
      </GlowBorder>
    </FadeContent>
  )
}

function RoomCard({
  index,
  title,
  items,
  icon: Icon,
  delay,
}: {
  index: string
  title: string
  items: readonly string[]
  icon: LucideIcon
  delay: number
}) {
  return (
    <FadeContent delay={delay}>
      <GlowBorder className="h-full">
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-void-200/85 to-void-200/45 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-muted/40 text-gold-400 transition group-hover:border-gold-400/35">
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400/55">
              {index}
            </span>
          </div>
          <h3 className="mt-5 font-display text-lg font-semibold text-white sm:text-xl">{title}</h3>
          <CheckList items={items} />
        </article>
      </GlowBorder>
    </FadeContent>
  )
}

export function ServicesSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <ServicesTitleCard />

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2 lg:gap-6">
          <HighlightCard
            eyebrow="Pricing"
            title="Custom quotes for every home"
            body={servicesPricingNote}
            icon={Banknote}
          />
          <HighlightCard
            eyebrow="Quality promise"
            title={servicesGuaranteedHeading}
            body={servicesGuaranteedBody}
            icon={ShieldCheck}
            delay={0.06}
          />
        </div>

        <FadeContent delay={0.08} className="mt-12 sm:mt-14">
          <div className="relative text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              The deep clean checklist
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </p>
            <p className="mt-2 text-sm text-fog">Structured room-by-room — nothing skipped, nothing rushed.</p>
          </div>
        </FadeContent>

        <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:gap-6">
          <RoomCard
            index="01"
            title={deepCleanIncludesHeading}
            items={deepCleanAllRooms}
            icon={Home}
            delay={0.1}
          />
          <RoomCard
            index="02"
            title={deepCleanKitchenHeading}
            items={deepCleanKitchen}
            icon={ChefHat}
            delay={0.14}
          />
          <RoomCard
            index="03"
            title={deepCleanBathroomHeading}
            items={deepCleanBathroom}
            icon={Bath}
            delay={0.18}
          />
        </div>

        <FadeContent delay={0.2} className="mt-8 lg:mt-10">
          <GlowBorder>
            <article className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-r from-gold-muted/25 via-void-200/80 to-void-200/60 p-6 sm:p-8">
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-muted/50 text-gold-400">
                    <Car className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400/90">
                      Add-on service
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-semibold text-white sm:text-2xl">
                      {garageAddonHeading}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-fog">{garageAddonBody}</p>
                  </div>
                </div>
                <Link to="/book" className="btn-primary relative shrink-0 !min-h-11 w-full sm:w-auto">
                  Book with add-on
                </Link>
              </div>
            </article>
          </GlowBorder>
        </FadeContent>
      </div>
    </section>
  )
}
