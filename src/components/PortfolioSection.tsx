import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { portfolioIntro, portfolioProjects, type PortfolioProject } from '../data/portfolio'
import { portfolioSrcSet } from '../lib/images'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { FadeContent } from './reactbits/FadeContent'
import { PageHeader } from './PageHeader'

function PortfolioCard({
  project,
  onOpen,
}: {
  project: PortfolioProject
  onOpen: (project: PortfolioProject) => void
}) {
  const img = portfolioSrcSet(project.image)

  return (
    <GlowBorder className="h-full w-full">
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="group relative w-full overflow-hidden rounded-2xl bg-void-200/60 text-left shadow-lg shadow-black/20 transition [touch-action:manipulation]"
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
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gold-400">
            <Sparkles className="h-3 w-3" aria-hidden />
            {project.service}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">
            {project.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-fog sm:text-sm">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            {project.location}
          </p>
        </div>
        </div>
      </button>
    </GlowBorder>
  )
}

function PortfolioLightbox({
  project,
  onClose,
}: {
  project: PortfolioProject
  onClose: () => void
}) {
  const img = portfolioSrcSet(project.image)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/85 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-hidden rounded-2xl border border-gold-400/25 bg-void-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="max-h-[40dvh] overflow-hidden sm:max-h-[50vh]">
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes="100vw"
            alt={project.imageAlt}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
            {project.service}
          </p>
          <h2 id="portfolio-modal-title" className="mt-1 font-display text-2xl font-semibold text-white">
            {project.title}
          </h2>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-fog">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {project.location}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-mist">{project.summary}</p>
          <Link
            to="/book"
            onClick={onClose}
            className="btn-primary mt-6 inline-flex !min-h-11 !px-6 !py-2.5 !text-sm"
          >
            Book your clean
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function PortfolioSection() {
  const [active, setActive] = useState<PortfolioProject | null>(null)

  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Portfolio"
          title="Homes we have cleaned"
          subtitle={portfolioIntro}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {portfolioProjects.map((project, i) => (
            <FadeContent key={project.id} delay={i * 0.05}>
              <PortfolioCard project={project} onOpen={setActive} />
            </FadeContent>
          ))}
        </div>

        <FadeContent delay={0.2} className="mt-14 text-center">
          <p className="text-sm text-fog">
            Want your home to look this good?{' '}
            <Link to="/book" className="font-semibold text-gold-400 hover:text-gold-300">
              Book online
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="font-semibold text-gold-400 hover:text-gold-300">
              request a quote
            </Link>
            .
          </p>
        </FadeContent>
      </div>

      <AnimatePresence>
        {active ? <PortfolioLightbox project={active} onClose={() => setActive(null)} /> : null}
      </AnimatePresence>
    </section>
  )
}
