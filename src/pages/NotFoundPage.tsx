import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-fog">
        This page doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </section>
  )
}
