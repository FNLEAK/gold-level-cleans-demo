import { portfolioIntro } from '../data/portfolio'
import { LuxuryTitleCard } from './LuxuryTitleCard'

export function PortfolioTitleCard() {
  return (
    <LuxuryTitleCard
      eyebrow="Our Work"
      titleLead="Homes we have"
      titleHighlight="cleaned"
      subtitle={portfolioIntro}
      tags={['Before & After', 'Real Homes', 'Gold Standard']}
      accentIcon="sparkles"
    />
  )
}
