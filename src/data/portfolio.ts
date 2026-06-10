export type PortfolioProject = {
  id: string
  title: string
  location: string
  service: string
  summary: string
  image: string
  imageAlt: string
  beforeImage?: string
  afterImage?: string
  beforeAlt?: string
  afterAlt?: string
}

export function isBeforeAfterProject(project: PortfolioProject) {
  return Boolean(project.beforeImage && project.afterImage)
}

export const portfolioIntro =
  'Real homes we have deep cleaned across the area. Drag the before & after sliders to see the Gold Level difference — client details omitted for privacy.'

/** Replace `image` paths with your own photos in `public/portfolio/`. */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'noblesville-kitchen',
    title: 'Kitchen & dining deep clean',
    location: 'Noblesville, IN',
    service: 'Before & after',
    summary:
      'Full kitchen and dining reset — clutter cleared, floors mopped, surfaces wiped, and the whole space brought back to move-in ready condition.',
    image: '/portfolio/noblesville-kitchen-after.png',
    imageAlt: 'Clean kitchen and dining area after a Gold Level deep clean in Noblesville',
    beforeImage: '/portfolio/noblesville-kitchen-before.png',
    afterImage: '/portfolio/noblesville-kitchen-after.png',
    beforeAlt: 'Cluttered kitchen and dining area before deep cleaning in Noblesville',
    afterAlt: 'Clean kitchen and dining area after a Gold Level deep clean in Noblesville',
  },
  {
    id: 'bathroom-vanity-reset',
    title: 'Bathroom vanity deep clean',
    location: 'Noblesville, IN',
    service: 'Before & after',
    summary:
      'Counter clutter cleared, sink scrubbed, fixtures polished, and surfaces wiped down — vanity brought back to a fresh, usable state.',
    image: '/portfolio/bathroom-vanity-after.jpg',
    imageAlt: 'Clean bathroom vanity and sink after a Gold Level deep clean',
    beforeImage: '/portfolio/bathroom-vanity-before.jpg',
    afterImage: '/portfolio/bathroom-vanity-after.jpg',
    beforeAlt: 'Cluttered bathroom vanity and sink before deep cleaning',
    afterAlt: 'Clean bathroom vanity and sink after a Gold Level deep clean',
  },
  {
    id: 'bathroom-sink-detail',
    title: 'Sink & faucet detail clean',
    location: 'Noblesville, IN',
    service: 'Before & after',
    summary:
      'Hair, grime, and water spots removed from the basin and chrome fixtures — drain area scrubbed and polished for a like-new finish.',
    image: '/portfolio/bathroom-sink-after.jpg',
    imageAlt: 'Polished bathroom faucet and clean sink after deep cleaning',
    beforeImage: '/portfolio/bathroom-sink-before.jpg',
    afterImage: '/portfolio/bathroom-sink-after.jpg',
    beforeAlt: 'Dirty bathroom sink with hair and grime before deep cleaning',
    afterAlt: 'Polished bathroom faucet and clean sink after deep cleaning',
  },
  {
    id: 'bathroom-medicine-cabinet',
    title: 'Medicine cabinet reset',
    location: 'Noblesville, IN',
    service: 'Before & after',
    summary:
      'Cabinet interior wiped, shelves cleared and reorganized, and mirror cleaned — toiletries sorted and surfaces sanitized.',
    image: '/portfolio/bathroom-cabinet-after.jpg',
    imageAlt: 'Organized medicine cabinet after a Gold Level bathroom deep clean',
    beforeImage: '/portfolio/bathroom-cabinet-before.jpg',
    afterImage: '/portfolio/bathroom-cabinet-after.jpg',
    beforeAlt: 'Cluttered medicine cabinet before deep cleaning',
    afterAlt: 'Organized medicine cabinet after a Gold Level bathroom deep clean',
  },
]
