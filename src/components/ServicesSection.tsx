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
  servicesIntro,
} from '../data/siteContent'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { FadeContent } from './reactbits/FadeContent'
import { PageHeader } from './PageHeader'

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed text-fog sm:text-[15px]">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-400" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  )
}

export function ServicesSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Services"
          title="Deep cleaning, room by room"
          subtitle={servicesIntro[0]}
        />

        <FadeContent className="mt-10">
          <GlowBorder>
            <div className="rounded-2xl bg-gold-400/5 p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                Custom quotes for every home
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fog sm:text-base">
                {servicesPricingNote}
              </p>
            </div>
          </GlowBorder>
        </FadeContent>

        <FadeContent className="mt-8">
          <GlowBorder>
            <div className="rounded-2xl bg-gold-400/5 p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                {servicesGuaranteedHeading}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fog sm:text-base">
                {servicesGuaranteedBody}
              </p>
            </div>
          </GlowBorder>
        </FadeContent>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <FadeContent>
            <GlowBorder className="h-full">
              <article className="h-full rounded-2xl bg-void-200/60 p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
                <h3 className="font-display text-lg font-semibold text-white">
                  {deepCleanIncludesHeading}
                </h3>
                <CheckList items={deepCleanAllRooms} />
              </article>
            </GlowBorder>
          </FadeContent>

          <FadeContent delay={0.06}>
            <GlowBorder className="h-full">
              <article className="h-full rounded-2xl bg-void-200/60 p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
                <h3 className="font-display text-lg font-semibold text-white">
                  {deepCleanKitchenHeading}
                </h3>
                <CheckList items={deepCleanKitchen} />
              </article>
            </GlowBorder>
          </FadeContent>

          <FadeContent delay={0.12}>
            <GlowBorder className="h-full">
              <article className="h-full rounded-2xl bg-void-200/60 p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
                <h3 className="font-display text-lg font-semibold text-white">
                  {deepCleanBathroomHeading}
                </h3>
                <CheckList items={deepCleanBathroom} />
              </article>
            </GlowBorder>
          </FadeContent>
        </div>

        <FadeContent delay={0.16} className="mt-8">
          <article className="rounded-2xl border border-dashed border-white/10 bg-void-200/40 p-7 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-white">
              {garageAddonHeading}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-fog">{garageAddonBody}</p>
          </article>
        </FadeContent>
      </div>
    </section>
  )
}
