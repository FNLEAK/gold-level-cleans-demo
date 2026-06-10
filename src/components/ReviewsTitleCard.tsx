import { reviewsIntro } from '../data/reviews'
import { LuxuryTitleCard } from './LuxuryTitleCard'

export function ReviewsTitleCard() {
  return (
    <LuxuryTitleCard
      eyebrow="Reviews"
      titleLead="What our"
      titleHighlight="clients say"
      subtitle={reviewsIntro}
      tags={['5-Star Rated', 'Google Reviews', 'Real Clients']}
      accentIcon="star"
    />
  )
}
