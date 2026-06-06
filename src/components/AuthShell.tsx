import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GlowBorder } from '@/components/ui/spotlight-card'
import { BUSINESS_NAME } from '../data/siteContent'
import { BrandLogo } from './BrandLogo'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative min-h-dvh bg-void text-mist">
      <div className="pointer-events-none fixed inset-0 gold-haze" aria-hidden />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-start px-[max(1rem,env(safe-area-inset-left))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] sm:pb-12 sm:pt-6 md:pt-8">
        <Link to="/" className="mb-5 flex justify-center [touch-action:manipulation] sm:mb-6">
          <BrandLogo size="auth" />
        </Link>
        <GlowBorder className="w-full">
          <div className="rounded-2xl bg-void-200/80 p-6 shadow-2xl shadow-black/40 sm:p-8">
          <p className="text-center font-sans text-xs font-semibold tracking-wide text-gold-400">
            {BUSINESS_NAME}
          </p>
          <h1 className="mt-2 text-center font-display text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-center font-sans text-sm text-fog">{subtitle}</p>
          <div className="mt-8">{children}</div>
          </div>
        </GlowBorder>
        {footer ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center font-sans text-sm leading-relaxed text-fog sm:mt-10 sm:gap-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
