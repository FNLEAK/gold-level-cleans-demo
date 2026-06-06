import { Loader2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../lib/api'
import type { ReactNode } from 'react'

type ProtectedRouteProps = {
  role: UserRole
  children: ReactNode
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-void text-fog">
        <Loader2 className="h-8 w-8 animate-spin text-gold-400" aria-hidden />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={role === 'owner' ? '/owner/sign-in' : '/sign-in'} replace />
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'owner' ? '/owner/dashboard' : '/account'} replace />
  }

  return children
}
