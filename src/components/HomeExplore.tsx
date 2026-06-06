import { Link } from 'react-router-dom'
import { Banknote, Calendar, ChevronRight, Home, Sparkles, Users } from 'lucide-react'
import { FadeContent } from './reactbits/FadeContent'
import { SpotlightCard } from './reactbits/SpotlightCard'

const tiles = [
  {
    to: '/about',
    title: 'About Us',
    desc: 'Meet Mykala and our gold-standard approach.',
    icon: Users,
  },
  {
    to: '/services',
    title: 'Services',
    desc: 'Room-by-room deep clean checklist.',
    icon: Home,
  },
  {
    to: '/price-list',
    title: 'Price List',
    desc: 'Transparent rates from $100 to full-house $500.',
    icon: Banknote,
  },
  {
    to: '/book',
    title: 'Book Online',
    desc: 'Pick your day. Up to 7 jobs per week.',
    icon: Calendar,
  },
  {
    to: '/contact',
    title: 'Contact',
    desc: 'Request a quote or send a message.',
    icon: Sparkles,
  },
] as const

export function HomeExplore() {
  return (
    <section className="border-t border-white/[0.08] px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <FadeContent className="text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            Explore
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            Everything you need in one place
          </h2>
        </FadeContent>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {tiles.map((t, i) => (
            <FadeContent key={t.to} delay={i * 0.06}>
              <SpotlightCard
                spotlightColor="rgba(160, 217, 185, 0.12)"
                className="h-full rounded-2xl border border-gold-400/20 bg-void-200/60 shadow-md shadow-black/20 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/10 hover:shadow-lg"
              >
                <Link
                  to={t.to}
                  className="group flex h-full flex-col p-5 sm:p-6 [touch-action:manipulation]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-muted text-gold-400 ring-1 ring-gold-400/20 transition group-hover:bg-gold-muted group-hover:text-gold-500">
                    <t.icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="mt-4 font-display text-lg font-semibold text-white">
                    {t.title}
                  </span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-fog">
                    {t.desc}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-400 transition group-hover:text-gold-400">
                    Open
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </SpotlightCard>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  )
}
