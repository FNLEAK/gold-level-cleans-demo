import { Link } from 'react-router-dom'
import { isBeforeAfterProject, portfolioProjects } from '../data/portfolio'
import { BeforeAfterCard } from './BeforeAfterCard'
import { PortfolioTitleCard } from './PortfolioTitleCard'
import { FadeContent } from './reactbits/FadeContent'

const beforeAfterProjects = portfolioProjects.filter(isBeforeAfterProject)

export function PortfolioSection() {
  return (
    <section className="px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <PortfolioTitleCard />

        {beforeAfterProjects.length > 0 ? (
          <div className="mt-14 space-y-10 sm:mt-16 sm:space-y-12">
            {beforeAfterProjects.map((project, i) => (
              <FadeContent key={project.id} delay={i * 0.06}>
                <BeforeAfterCard project={project} />
              </FadeContent>
            ))}
          </div>
        ) : null}

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
    </section>
  )
}
