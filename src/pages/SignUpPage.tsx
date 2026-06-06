import { Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'

export function SignUpPage() {
  const { user, loading, signUpCustomer } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user?.role === 'customer') return <Navigate to="/account" replace />

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(e.currentTarget)
    try {
      await signUpCustomer({
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        phone: String(form.get('phone') ?? ''),
      })
      navigate('/account')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Book online and track your Gold Level deep cleans."
      footer={
        <>
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Already have an account?</span>
            <Link to="/sign-in" className="font-semibold text-gold-400 hover:text-gold-300">
              Sign in
            </Link>
          </p>
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
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-fog">
            Full name
          </label>
          <input id="name" name="name" required className="input-field mt-1.5" />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-fog">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input-field mt-1.5" />
        </div>
        <div>
          <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-fog">
            Phone (optional)
          </label>
          <input id="phone" name="phone" type="tel" className="input-field mt-1.5" />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-fog">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="input-field mt-1.5"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full !rounded-xl">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
