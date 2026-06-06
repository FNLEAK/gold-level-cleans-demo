import { Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

export function OwnerSignInPage() {
  const { user, loading, signInOwner } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user?.role === 'owner') return <Navigate to="/owner/dashboard" replace />
  if (!loading && user?.role === 'customer') return <Navigate to="/404" replace />

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(e.currentTarget)
    try {
      await signInOwner(String(form.get('email')), String(form.get('password')))
      navigate('/owner/dashboard')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign in failed'
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid email or password.')
      } else if (msg.toLowerCase().includes('owner access') || msg.toLowerCase().includes('customer')) {
        setError('Access denied.')
      } else {
        setError('Sign in failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Enter your credentials to continue."
      footer={
        <Link to="/" className="text-fog hover:text-mist">
          Back to website
        </Link>
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
            autoComplete="username"
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
            autoComplete="current-password"
            className="input-field mt-1.5"
            placeholder="Password"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full !rounded-xl">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}
