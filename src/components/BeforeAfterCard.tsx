import { MapPin, Sparkles } from 'lucide-react'
import { BeforeAfterSlider } from './BeforeAfterSlider'
import { GlowBorder } from '@/components/ui/spotlight-card'
import type { PortfolioProject } from '../data/portfolio'

export function BeforeAfterCard({ project }: { project: PortfolioProject }) {
  if (!project.beforeImage || !project.afterImage) return null

  return (
    <GlowBorder className="h-full w-full overflow-hidden">
      <article className="overflow-hidden rounded-2xl bg-void-200/60">
        <BeforeAfterSlider
          beforeSrc={project.beforeImage}
          afterSrc={project.afterImage}
          beforeAlt={project.beforeAlt ?? `${project.title} before cleaning`}
          afterAlt={project.afterAlt ?? project.imageAlt}
        />
        <div className="border-t border-white/[0.06] p-5 sm:p-6">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-400">
            <Sparkles className="h-3 w-3" aria-hidden />
            {project.service}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-fog">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-400/70" aria-hidden />
            {project.location}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-mist/90">{project.summary}</p>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-fog/70">
            Drag the slider to reveal the transformation
          </p>
        </div>
      </article>
    </GlowBorder>
  )
}
