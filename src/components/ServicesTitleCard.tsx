import { servicesIntro } from '../data/siteContent'
import { LuxuryTitleCard } from './LuxuryTitleCard'

export function ServicesTitleCard() {
  return (
    <LuxuryTitleCard
      eyebrow="Services"
      titleLead="Deep cleaning,"
      titleHighlight="room by room"
      subtitle={servicesIntro[0]}
      tags={['Deep Clean', 'Every Room', 'Detail Driven']}
      accentIcon="sparkles"
    />
  )
}
