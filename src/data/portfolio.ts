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
    id: 'full-house-lafayette',
    title: 'Full house deep clean',
    location: 'Lafayette, IN',
    service: 'Whole-home reset',
    summary:
      'Top-to-bottom deep clean with kitchen degrease, bathrooms sanitized, baseboards, and floors throughout a 3-bedroom home.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Bright living room after a full house deep clean',
  },
  {
    id: 'bathroom-sanitize',
    title: 'Bathroom deep clean',
    location: 'Noblesville, IN',
    service: 'Bathrooms',
    summary:
      'Double vanity, granite counters, fixtures polished, and mirrors streak-free — part of a full-home deep clean.',
    image: '/portfolio/bathroom-double-vanity.png',
    imageAlt: 'Spotless bathroom with double vanity, granite counters, and polished fixtures after a Gold Level deep clean',
  },
  {
    id: 'kitchen-refresh',
    title: 'Kitchen deep clean',
    location: 'West Lafayette, IN',
    service: 'Kitchen focus',
    summary:
      'Appliances wiped, cabinets degreased, backsplash scrubbed, and floors mopped for a move-in ready finish.',
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Clean modern kitchen counters and appliances',
  },
  {
    id: 'two-bed-apartment',
    title: '2 bedroom apartment',
    location: 'Tippecanoe County, IN',
    service: '2BR+ deep clean',
    summary:
      'Every room detailed for a tenant turnover: bathrooms, bedrooms, living area, and entryway.',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Clean apartment living space with natural light',
  },
  {
    id: 'move-out-clean',
    title: 'Move-out deep clean',
    location: 'West Lafayette, IN',
    service: 'Move-out reset',
    summary:
      'Empty-home deep clean before listing, including inside cabinets, closets, and all surfaces reset for showings.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Empty clean home interior ready for move-out',
  },
  {
    id: 'garage-addon',
    title: 'Garage + home package',
    location: 'Tippecanoe County, IN',
    service: 'Full house + garage add-on',
    summary:
      'Interior deep clean paired with garage sweep, surface wipe-down, and organized floor space.',
    image:
      'https://images.unsplash.com/photo-1600573472591-ee6b68c00c08?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Clean organized garage and home exterior',
  },
]
