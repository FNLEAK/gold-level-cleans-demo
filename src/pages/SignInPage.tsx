import { Loader2 } from 'lucide-react'

import { useState, type FormEvent } from 'react'

import { Link, Navigate, useNavigate } from 'react-router-dom'

import { AuthShell } from '../components/AuthShell'

import { useAuth } from '../context/AuthContext'



export function SignInPage() {

  const { user, loading, signInCustomer } = useAuth()

  const navigate = useNavigate()

  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)



  if (!loading && user?.role === 'customer') return <Navigate to="/account" replace />

  if (!loading && user?.role === 'owner') return <Navigate to="/owner/dashboard" replace />



  async function onSubmit(e: FormEvent<HTMLFormElement>) {

    e.preventDefault()

    setSubmitting(true)

    setError('')

    const form = new FormData(e.currentTarget)

    const email = String(form.get('email') ?? '')

    const password = String(form.get('password') ?? '')



    try {

      await signInCustomer(email, password)

      navigate('/account')

    } catch (err) {

      setError(err instanceof Error ? err.message : 'Sign in failed')

    } finally {

      setSubmitting(false)

    }

  }



  return (

    <AuthShell

      title="Customer sign in"

      subtitle="View your bookings and schedule your next deep clean."

      footer={

        <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">

          <span>New here?</span>

          <Link to="/sign-up" className="font-semibold text-gold-400 hover:text-gold-300">

            Create an account

          </Link>

        </p>

      }

    >

      <form onSubmit={onSubmit} className="space-y-4">

        {error ? (

          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">

            {error}

          </p>

        ) : null}

        <div>

          <label htmlFor="email" className="text-xs font-semibold tracking-wide text-fog">

            Email

          </label>

          <input id="email" name="email" type="email" required className="input-field mt-1.5" />

        </div>

        <div>

          <label htmlFor="password" className="text-xs font-semibold tracking-wide text-fog">

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

          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}

        </button>

      </form>

    </AuthShell>

  )

}

