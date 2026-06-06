import { CheckCircle2 } from 'lucide-react'
import { whatWeOfferHeading, whatWeOfferItems } from '../data/siteContent'
import { FadeContent } from './reactbits/FadeContent'

export function WhatWeOffer() {
  return (
    <section className="border-t border-white/[0.08] px-[max(1rem,env(safe-area-inset-left))] py-14 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <FadeContent className="max-w-2xl">
          <p className="font-sans text-sm font-bold uppercase tracking-widest text-gold-400">
            Why Gold Level
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            {whatWeOfferHeading}
          </h2>
        </FadeContent>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {whatWeOfferItems.map((item, i) => (
            <FadeContent key={item} delay={i * 0.06}>
              <li className="flex gap-3 card-surface p-5 sm:p-6">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden />
                <p className="font-sans text-sm leading-relaxed text-fog sm:text-[15px]">{item}</p>
              </li>
            </FadeContent>
          ))}
        </ul>
      </div>
    </section>
  )
}
