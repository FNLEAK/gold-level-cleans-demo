import { PHONE_DISPLAY } from './siteContent'

export function getBotReply(input: string): string {
  const q = input.toLowerCase().trim()

  if (/\b(price|pricing|cost|how much|rate|quote)\b/.test(q)) {
    return `Pricing varies home to home based on size, layout, and add-ons. Visit the Services page for what we include, then book online or call ${PHONE_DISPLAY} for a custom quote.`
  }

  if (/\b(garage|add.?on|addon)\b/.test(q)) {
    return 'Our Garage Deep Clean add-on can be added to any deep clean package. It includes sweeping, surface wiping, and a clutter-friendly reset. Contact us for a quote.'
  }

  if (/\b(portfolio|gallery|photos|before|after|past work|examples)\b/.test(q)) {
    return 'See homes we have cleaned on the Portfolio page. Tap a project for details and photos from completed deep cleans.'
  }

  if (/\b(deep clean|what'?s included|include|service)\b/.test(q)) {
    return 'Every deep clean covers all rooms (dusting, floors, baseboards), full kitchen degreasing, and bathroom sanitizing. Check the Services page for the full checklist.'
  }

  if (/\b(owner|mykala|who)\b/.test(q)) {
    return `Gold Level Cleans is owner-operated by Mykala Ashbaugh. You get direct accountability on every job.`
  }

  if (/\b(phone|call|number|contact)\b/.test(q)) {
    return `Reach us at ${PHONE_DISPLAY} or MykalaAshbaugh353@gmail.com. The Contact page has a form too.`
  }

  if (/\b(email|mail)\b/.test(q)) {
    return `Email Mykala Ashbaugh at MykalaAshbaugh353@gmail.com.`
  }

  if (/\b(1 bed|one bed|1br|single bed|2 bed|full house|whole house)\b/.test(q)) {
    return 'We deep clean homes of all sizes, from one-bedroom apartments to full houses. Book online or contact us and we will confirm a custom quote for your layout.'
  }

  if (/\b(book|booking|schedule|appointment|available|slot)\b/.test(q)) {
    return 'Clients can book online at /book. Pick a date and we confirm by email. We cap at 7 deep cleans per week so quality stays high.'
  }

  return `I can help with services, booking, or contact info for Gold Level Cleans. Try asking about our deep clean checklist or say "book" to schedule.`
}
