import { type FormEvent, type ReactNode, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, Phone, Send } from 'lucide-react'
import { BRAND_TAGLINE, BUSINESS_NAME, EMAIL, footerCopyright, PHONE_DISPLAY, PHONE_TEL, SERVICE_COUNTIES } from '../data/siteContent'
import { mainNavLinks } from '../data/navLinks'

const footerLink =
  'flex min-h-11 items-center text-[13px] text-fog transition hover:text-gold-400 [touch-action:manipulation]'

const quickLinks = mainNavLinks.filter((l) => l.to !== '/contact')

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
      {children}
    </h3>
  )
}

function SocialIcon({ label, children, href }: { label: string; children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-void-200/60 text-fog transition hover:border-gold-400/30 hover:text-gold-400"
      aria-label={label}
    >
      {children}
    </a>
  )
}

function NewsletterSignup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    const params = new URLSearchParams({
      email: trimmed,
      message: 'Please add me to Gold Level Cleans updates and booking reminders.',
    })
    navigate(`/contact?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex overflow-hidden rounded-xl border border-white/10 bg-void-200/60 shadow-inner transition focus-within:border-gold-400/40 focus-within:ring-2 focus-within:ring-gold-400/10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="min-w-0 flex-1 bg-transparent px-4 py-3 font-sans text-sm text-mist outline-none placeholder:text-fog/60"
          aria-label="Email for updates"
        />
        <button
          type="submit"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center bg-gold-400 px-4 text-void transition hover:bg-gold-300 [touch-action:manipulation]"
          aria-label="Subscribe"
        >
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/[0.08] bg-void-100/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-[max(1rem,env(safe-area-inset-left))] py-12 pr-[max(1rem,env(safe-area-inset-right))] md:px-8 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
          {/* Stay connected */}
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterHeading>Stay connected</FooterHeading>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fog">
              Get booking reminders, seasonal deep clean tips, and exclusive offers from{' '}
              {BUSINESS_NAME}.
            </p>
            <NewsletterSignup />
            <p className="mt-3 text-[11px] text-fog/70">{BRAND_TAGLINE}</p>
          </div>

          {/* Quick links */}
          <div>
            <FooterHeading>Quick links</FooterHeading>
            <nav className="mt-4 flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `${footerLink}${isActive ? ' font-medium text-gold-400' : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/contact" className={footerLink}>
                Contact us
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>Contact us</FooterHeading>
            <ul className="mt-4 space-y-3 text-sm text-fog">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" aria-hidden />
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gold-400/90">
                    Counties served
                  </span>
                  <span className="mt-0.5 block">{SERVICE_COUNTIES}</span>
                </span>
              </li>
              <li>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center gap-2.5 transition hover:text-gold-400"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold-400/80" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-start gap-2.5 break-all transition hover:text-gold-400"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400/80" aria-hidden />
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Follow + account */}
          <div>
            <FooterHeading>Follow us</FooterHeading>
            <p className="mt-3 text-sm text-fog">Connect for updates and before/after photos.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <SocialIcon label="Facebook" href="https://facebook.com">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.022 4.388 11.01 10.125 11.908v-8.42H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796v8.42C19.612 23.083 24 18.095 24 12.073z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Instagram" href="https://instagram.com">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </SocialIcon>
              <a
                href={`mailto:${EMAIL}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-void-200/60 text-fog transition hover:border-gold-400/30 hover:text-gold-400"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="mt-6 space-y-2 border-t border-white/[0.06] pt-5">
              <Link to="/sign-in" className={`block ${footerLink}`}>
                Customer sign in
              </Link>
              <Link to="/owner/sign-in" className={`block ${footerLink} text-white/35 hover:text-white/55`}>
                Owner admin
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-gold-400 hover:text-gold-300"
              >
                Book a clean
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-fog/80">{footerCopyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link to="/contact" className={footerLink}>
              Privacy &amp; quotes
            </Link>
            <Link to="/services" className={footerLink}>
              Service terms
            </Link>
            <Link to="/contact" className={footerLink}>
              Cookie preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
