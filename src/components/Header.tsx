import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Star, User, X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { GoldStreakLine } from '@/components/ui/gold-streak-line'
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

function MobileMenuToggle({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={`group relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 [touch-action:manipulation] ${
        open
          ? 'animate-none border-gold-400/45 bg-gold-muted text-gold-300 shadow-[0_0_22px_-4px_rgba(212,175,55,0.6)]'
          : 'animate-menu-btn-glow border-gold-400/25 bg-gradient-to-br from-white/[0.07] via-void-200/80 to-gold-muted/50 text-gold-400 hover:border-gold-400/40 hover:text-gold-300'
      }`}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open menu'}
      onClick={onToggle}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(252,246,186,0.12),transparent_65%)] opacity-80"
        aria-hidden
      />
      <span
        className={`pointer-events-none absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gold-300/90 transition-opacity duration-300 ${
          open ? 'opacity-0' : 'animate-menu-sparkle-twinkle opacity-100'
        }`}
        aria-hidden
      />
      {open ? (
        <X className="relative h-5 w-5 transition-transform duration-300" />
      ) : (
        <Star
          className="relative h-[1.35rem] w-[1.35rem] animate-menu-sparkle-twinkle"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
    </button>
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
      className="relative bg-[#050505]/95 backdrop-blur-md"
    >
      <div className="relative border-b border-white/[0.08] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.5rem,env(safe-area-inset-top))] md:px-8 md:pt-[max(0.75rem,env(safe-area-inset-top))]">
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
          <MobileMenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
        </div>
      </div>
      <GoldStreakLine wide className="absolute inset-x-0 bottom-0 z-10" duration={4.5} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gold-400/15 bg-gradient-to-b from-gold-muted/20 to-transparent lg:hidden"
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
