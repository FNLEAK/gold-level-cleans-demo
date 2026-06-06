import { Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'
import { EMAIL, OWNER_NAME } from '../data/siteContent'

const ADMIN_EMAIL = 'admin@goldlevelcleans.com'

export function OwnerSignInPage() {
  const { user, loading, signInOwner } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user?.role === 'owner') return <Navigate to="/owner/dashboard" replace />
  if (!loading && user?.role === 'customer') return <Navigate to="/account" replace />

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(e.currentTarget)
    try {
      await signInOwner(String(form.get('email')), String(form.get('password')))
      navigate('/owner/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Owner sign in"
      subtitle="Manage bookings, weekly capacity, and live site activity. Stay signed in for 30 days."
      footer={
        <>
          <Link to="/" className="text-fog hover:text-mist">
            Back to website
          </Link>
          <Link to="/sign-in" className="text-fog hover:text-mist">
            Customer sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="owner-email" className="text-xs font-semibold tracking-wide text-fog">
            Email
          </label>
          <input
            id="owner-email"
            name="email"
            type="email"
            required
            defaultValue={EMAIL}
            className="input-field mt-1.5"
          />
        </div>
        <div>
          <label htmlFor="owner-password" className="text-xs font-semibold tracking-wide text-fog">
            Password
          </label>
          <input
            id="owner-password"
            name="password"
            type="password"
            required
            className="input-field mt-1.5"
            placeholder="Your password"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full !rounded-xl">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Open owner dashboard'}
        </button>
      </form>
      <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-void-200/40 p-3 text-[11px] leading-relaxed text-fog">
        <p>
          <span className="font-semibold text-mist">Owner ({OWNER_NAME}):</span>{' '}
          <span className="text-gold-400">{EMAIL}</span> · password{' '}
          <span className="text-gold-400">GoldLevel353</span>
        </p>
        <p>
          <span className="font-semibold text-mist">Admin:</span>{' '}
          <span className="text-gold-400">{ADMIN_EMAIL}</span> · password{' '}
          <span className="text-gold-400">GoldAdmin353</span>
        </p>
      </div>
    </AuthShell>
  )
}
