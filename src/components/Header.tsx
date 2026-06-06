import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Shield, User, X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { mainNavLinks } from '../data/navLinks'
import { useAuth } from '../context/AuthContext'

function textNavClass(isActive: boolean) {
  return [
    'rounded-lg px-3.5 py-2 font-sans text-[13px] font-medium tracking-wide transition-colors [touch-action:manipulation]',
    isActive
      ? 'bg-gold-muted text-gold-400'
      : 'text-white/50 hover:bg-white/[0.05] hover:text-white/92',
  ].join(' ')
}

function AccountLink() {
  const { user } = useAuth()

  if (user?.role === 'owner') {
    return (
      <Link to="/owner/dashboard" className={textNavClass(false)}>
        <span className="inline-flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" aria-hidden />
          Admin
        </span>
      </Link>
    )
  }

  if (user?.role === 'customer') {
    return (
      <Link to="/account" className={textNavClass(false)}>
        <span className="inline-flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" aria-hidden />
          My account
        </span>
      </Link>
    )
  }

  return (
    <Link to="/sign-in" className={textNavClass(false)}>
      Sign in
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
      className="sticky top-0 z-[100] border-b border-white/[0.08] bg-[#050505]/95 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-md md:px-8 md:pt-[max(0.75rem,env(safe-area-inset-top))]"
    >
      <div className="mx-auto max-w-6xl py-1.5 md:py-2.5">
        {/* Desktop — logo + nav centered */}
        <div className="hidden items-center justify-center gap-5 lg:flex xl:gap-7">
          <Link to="/" className="shrink-0 [touch-action:manipulation]">
            <BrandLogo />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-0.5">
            {mainNavLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => textNavClass(isActive)}
              >
                {l.label}
              </NavLink>
            ))}
            <AccountLink />
          </nav>
        </div>

        {/* Mobile — logo left, menu right */}
        <div className="flex items-center justify-between lg:hidden">
          <Link to="/" className="shrink-0 [touch-action:manipulation]">
            <BrandLogo />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:text-white"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/[0.06] lg:hidden"
          >
            <nav className="mx-auto flex max-w-6xl max-h-[min(70dvh,28rem)] flex-col gap-0.5 overflow-y-auto overscroll-contain px-1 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {mainNavLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-lg px-3 py-2.5 font-sans text-[15px] font-medium [touch-action:manipulation] ${isActive ? 'bg-gold-muted text-gold-400' : 'text-white/80'}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
              {user?.role === 'owner' ? (
                <Link
                  to="/owner/dashboard"
                  className="flex min-h-11 items-center rounded-lg px-3 py-2.5 font-sans text-[15px] text-white/80"
                  onClick={() => setOpen(false)}
                >
                  Admin dashboard
                </Link>
              ) : user?.role === 'customer' ? (
                <Link
                  to="/account"
                  className="flex min-h-11 items-center rounded-lg px-3 py-2.5 font-sans text-[15px] text-white/80"
                  onClick={() => setOpen(false)}
                >
                  My account
                </Link>
              ) : (
                <Link
                  to="/sign-in"
                  className="flex min-h-11 items-center rounded-lg px-3 py-2.5 font-sans text-[15px] text-white/80"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              )}
              {user ? (
                <button
                  type="button"
                  className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-left font-sans text-[15px] text-fog"
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                >
                  Sign out
                </button>
              ) : null}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
