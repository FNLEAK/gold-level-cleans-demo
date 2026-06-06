export const BUSINESS_NAME = 'Gold Level Cleans'
export const BRAND_TAGLINE = 'Clean spaces. High standards.'
export const OWNER_NAME = 'Mykala Ashbaugh'
export const OWNER_HEADSHOT = '/mykala-ashbaugh.jpg'
export const OWNER_HEADSHOT_ALT = 'Mykala Ashbaugh, owner of Gold Level Cleans'

export const PHONE_DISPLAY = '(765) 639-7981'
export const PHONE_TEL = '+17656397981'
export const EMAIL = 'MykalaAshbaugh353@gmail.com'

export const SERVICE_COUNTIES = 'Anderson, Muncie, Indianapolis, Alexandria & more'

export const heroTagline = 'Premium deep cleaning, every corner, every time.'

export const heroHighlights = [
  {
    title: 'Deep clean specialists',
    body: 'Kitchens, bathrooms, bedrooms, and living spaces scrubbed top to bottom.',
    icon: 'sparkles' as const,
  },
  {
    title: 'Custom home quotes',
    body: 'Every layout is different. We confirm pricing before your clean, with no surprises.',
    icon: 'home' as const,
  },
  {
    title: 'Owner-operated care',
    body: 'Mykala Ashbaugh personally stands behind every Gold Level clean.',
    icon: 'shield' as const,
  },
] as const

export const homeProcessSteps = [
  {
    step: '01',
    title: 'Book online',
    body: 'Pick a date that works. We take up to 7 deep cleans per week so quality stays high.',
  },
  {
    step: '02',
    title: 'We deep clean',
    body: 'Every room on our checklist: kitchens degreased, baths sanitized, floors and baseboards done right.',
  },
  {
    step: '03',
    title: 'Walk in amazed',
    body: 'Come home to a space that feels brand new, with gold standard results every time.',
  },
] as const

export const homeTrustStats = [
  { value: '7', label: 'Jobs max / week', sub: 'Quality over quantity' },
  { value: '100%', label: 'Owner-operated', sub: 'Mykala on every job' },
  { value: 'Custom', label: 'Quotes per home', sub: 'Sized to your space' },
  { value: '5★', label: 'Gold standard', sub: 'Clean spaces. High standards.' },
] as const

export const aboutParagraphs = [
  'Gold Level Cleans delivers thorough, detail-oriented deep cleaning for homes that deserve more than a quick wipe-down. We focus on the grime you see and the buildup you don’t, so your space feels truly refreshed.',
  'From single-bedroom apartments to full-house resets, we bring professional-grade supplies and a gold standard checklist to every job. Owner Mykala Ashbaugh built this service around reliability, respect for your home, and results you can see the moment you walk in.',
] as const

export const aboutYouHeading = 'Your home deserves Gold Level care'

export const aboutYouLines = [
  'Move-in or move-out? We reset every surface.',
  'Seasonal deep clean? We tackle baseboards, vents, and forgotten corners.',
  'Garage clutter and grime? Add our garage deep clean to any package.',
  'Busy schedule? Book once and come home to a spotless space.',
] as const

export const callTodayHeading = 'Ready for a spotless home?'

export const whatWeOfferHeading = 'What we offer'

export const whatWeOfferItems = [
  'Whole-home deep cleaning with room-by-room attention',
  'Kitchen & bathroom degreasing and sanitizing',
  'Bedroom, living area, and hallway detail work',
  'Optional garage deep clean add-on',
  'Flexible scheduling that works around your day',
] as const

export const servicesIntro = [
  'Gold Level Cleans specializes in deep cleaning, not quick surface tidying. Every visit follows a structured checklist designed to lift dirt, dust, and buildup from the places routine cleaning misses.',
] as const

export const servicesGuaranteedHeading = 'Deep cleans you can trust'

export const servicesGuaranteedBody =
  'Whether you need a one-bedroom refresh or a full-house reset, we treat your home with the same care we would our own. Add-ons like garage deep cleaning are available on any package.'

export const deepCleanIncludesHeading = 'Every deep clean includes'

export const deepCleanAllRooms = [
  'Dusting all reachable surfaces & fixtures',
  'Vacuuming & mopping floors',
  'Baseboards & door frames wiped',
  'Light switches & handles sanitized',
  'Trash emptied & liners replaced',
] as const

export const deepCleanKitchenHeading = 'Kitchen'
export const deepCleanKitchen = [
  'Countertops & backsplash scrubbed',
  'Appliance exteriors degreased',
  'Sink & faucet polished',
  'Cabinet fronts wiped',
  'Microwave interior cleaned',
] as const

export const deepCleanBathroomHeading = 'Bathrooms'
export const deepCleanBathroom = [
  'Toilets, tubs & showers scrubbed',
  'Mirrors & glass streak-free',
  'Vanities & countertops sanitized',
  'Fixtures polished',
  'Floors mopped & dried',
] as const

export const garageAddonHeading = 'Garage deep clean add-on'
export const garageAddonBody =
  'Sweep, organize surfaces, and degrease high-traffic zones in your garage. Perfect paired with any deep clean package.'

export const servicesPricingNote =
  'Pricing varies home to home. Layout, size, condition, and add-ons all factor in. Book online or contact us and we will confirm a custom quote before your clean.'

export const pricesSectionHeading = 'Pricing'

export const pricingTiers = [
  {
    id: '1br',
    name: '1 Bedroom Deep Clean',
    price: '$100',
    description: 'Complete deep clean for a one-bedroom home or apartment.',
    featured: false,
    addon: false,
  },
  {
    id: '2br',
    name: '2 Bedroom+ Deep Clean',
    price: 'From $200',
    description: 'Starting at $200 and up per bedroom, scaled to your layout.',
    featured: true,
    addon: false,
  },
  {
    id: 'full',
    name: 'Full House Deep Clean',
    price: '$500',
    description: 'Whole-home deep clean for maximum refresh before or after a big event.',
    featured: false,
    addon: false,
  },
  {
    id: 'garage',
    name: 'Garage Deep Clean Add-on',
    price: '$120',
    description: 'Add to any package. Floors swept, surfaces wiped, clutter-friendly reset.',
    featured: false,
    addon: true,
  },
] as const

export const pricingNote =
  'Final quotes may vary based on home size, condition, and add-ons. Contact us for a personalized estimate.'

export const contactHeading = 'Contact Us'
export const contactCallHeading = 'Book your Gold Level deep clean'

export const footerCopyright = `© ${new Date().getFullYear()} Gold Level Cleans. All rights reserved.`
