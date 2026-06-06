export type PortfolioProject = {
  id: string
  title: string
  location: string
  service: string
  summary: string
  image: string
  imageAlt: string
}

export const portfolioIntro =
  'Real homes we have deep cleaned across the area: kitchens, bathrooms, bedrooms, and full-house resets. Photos are from completed Gold Level jobs (client details omitted for privacy).'

/** Replace `image` paths with your own photos in `public/portfolio/`. */
export const portfolioProjects: PortfolioProject[] = [
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
    location: 'Lafayette, IN',
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
