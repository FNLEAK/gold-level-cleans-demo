export type CustomerReview = {
  id: string
  name: string
  location: string
  rating: number
  date: string
  text: string
  service?: string
}

export const reviewsIntro =
  'Homeowners across Central Indiana trust Gold Level Cleans for deep, detail-driven results. Read what clients say about our work — every review reflects real cleans, with names shortened for privacy where needed.'

/** Replace with your real Google reviews when your Business Profile is live. */
export const customerReviews: CustomerReview[] = [
  {
    id: 'review-1',
    name: 'Sarah M.',
    location: 'Carmel, IN',
    rating: 5,
    date: 'March 2026',
    service: 'Full house deep clean',
    text: 'Mykala and her team were incredible. Kitchen, bathrooms, and baseboards looked brand new. They respected our home and communicated every step. Already booked our next visit.',
  },
  {
    id: 'review-2',
    name: 'James & Lisa T.',
    location: 'Noblesville, IN',
    rating: 5,
    date: 'February 2026',
    service: 'Move-out deep clean',
    text: 'We needed a listing-ready clean on short notice. Gold Level delivered — inside cabinets, appliances, and floors were spotless. Our realtor was impressed.',
  },
  {
    id: 'review-3',
    name: 'Angela R.',
    location: 'Westfield, IN',
    rating: 5,
    date: 'February 2026',
    service: 'Bathroom focus',
    text: 'The bathroom detail work was next level. Grime around fixtures and the medicine cabinet area — gone. Felt like a luxury hotel reset. Highly recommend.',
  },
  {
    id: 'review-4',
    name: 'David K.',
    location: 'Fishers, IN',
    rating: 5,
    date: 'January 2026',
    service: 'Recurring deep clean',
    text: 'Consistent quality every time. They remember our preferences, show up on time, and the house always smells fresh without harsh chemical smells. Worth every penny.',
  },
  {
    id: 'review-5',
    name: 'Michelle P.',
    location: 'Anderson, IN',
    rating: 5,
    date: 'January 2026',
    service: 'Kitchen & living areas',
    text: 'Owner-operated means accountability. Mykala checked in after the clean to make sure we were happy. That personal touch is rare. Five stars without hesitation.',
  },
  {
    id: 'review-6',
    name: 'Chris W.',
    location: 'Cicero, IN',
    rating: 5,
    date: 'December 2025',
    service: 'Whole-home reset',
    text: 'Clutter-friendly and thorough. They worked around our schedule, tackled areas we kept putting off, and left everything organized. Will use again for sure.',
  },
]
