import { motion } from 'framer-motion'
import { ArrowRight, Calendar, ChevronRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GoldStreakConnectors } from '@/components/ui/gold-streak-line'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { homeProcessSteps, homeTrustStats, OWNER_NAME } from '../data/siteContent'
import { portfolioProjects } from '../data/portfolio'
import { portfolioSrcSet } from '../lib/images'
import { FadeContent } from './reactbits/FadeContent'

const easeOut = [0.22, 1, 0.36, 1] as const

const featuredWork = portfolioProjects.slice(0, 3)

export function HomeSections() {
  return (
    <>
      {/* Trust strip */}
      <section className="border-y border-white/[0.06] bg-void-100/40 px-[max(1rem,env(safe-area-inset-left))] py-10 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {homeTrustStats.map((stat, i) => (
            <FadeContent key={stat.label} delay={i * 0.05}>
              <div className="text-center lg:border-r lg:border-white/[0.06] lg:last:border-r-0">
                <p className="font-display text-3xl font-bold text-gold-400 sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                <p className="mt-1 text-xs text-fog">{stat.sub}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-[max(1rem,env(safe-area-inset-left))] py-14 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.04] blur-[80px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <FadeContent className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              Simple process
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-4xl">
              How Gold Level works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-fog sm:text-base">
              From booking to final walkthrough, a premium deep clean without the hassle.
            </p>
          </FadeContent>

          <div className="relative mt-12">
            <GoldStreakConnectors className="top-12 z-[1] hidden md:grid" />
            <div className="relative z-10 grid gap-6 md:grid-cols-3 md:gap-8">
            {homeProcessSteps.map((step, i) => (
              <FadeContent key={step.step} delay={i * 0.08} className="h-full">
                <GlowBorder className="h-full">
                  <article className="relative h-full rounded-2xl bg-void-200 p-6 backdrop-blur-sm sm:p-8">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-muted font-display text-sm font-bold text-gold-400">
                      {step.step}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-fog">{step.body}</p>
                  </article>
                </GlowBorder>
              </FadeContent>
            ))}
            </div>
          </div>

          <FadeContent delay={0.2} className="mt-10 flex justify-center">
            <Link to="/book" className="btn-primary group !min-h-11 !px-8">
              Start with a booking
              <Calendar className="h-4 w-4" />
            </Link>
          </FadeContent>
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="border-t border-white/[0.06] px-[max(1rem,env(safe-area-inset-left))] py-14 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <FadeContent>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                Our work
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-4xl">
                Homes we&apos;ve transformed
              </h2>
            </FadeContent>
            <FadeContent delay={0.05}>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300"
              >
                View full portfolio
                <ChevronRight className="h-4 w-4" />
              </Link>
            </FadeContent>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWork.map((project, i) => {
              const img = portfolioSrcSet(project.image)
              return (
              <FadeContent key={project.id} delay={i * 0.06}>
                <Link
                  to="/portfolio"
                  className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-void-200/40 [touch-action:manipulation]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={img.src}
                      srcSet={img.srcSet}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt={project.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                        {project.service}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-white">{project.title}</p>
                      <p className="mt-1 text-xs text-fog">{project.location}</p>
                    </div>
                  </div>
                </Link>
              </FadeContent>
            )})}
          </div>
        </div>
      </section>

      {/* Owner + CTA */}
      <section className="px-[max(1rem,env(safe-area-inset-left))] pb-14 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:pb-20">
        <GlowBorder className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-muted/40 via-void-200/90 to-void-200/60 p-8 text-center shadow-[0_32px_80px_-32px_rgba(212,175,55,0.25)] sm:p-12 md:p-14"
          >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.12),transparent_50%)]"
            aria-hidden
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-black/20 px-4 py-1.5 text-xs font-semibold text-gold-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Ready when you are
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold text-white sm:text-4xl">
              Your home deserves Gold Level care
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-fog sm:text-base">
              {OWNER_NAME} personally oversees every deep clean. Book online or reach out for a custom
              quote tailored to your home.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <Link to="/book" className="btn-primary group w-full sm:w-auto">
                Book your deep clean
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link to="/contact" className="btn-secondary w-full sm:w-auto">
                Request a quote
              </Link>
            </div>
          </div>
          </motion.div>
        </GlowBorder>
      </section>
    </>
  )
}
