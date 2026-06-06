import { Loader2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import type { UserRole } from '../lib/api'
import type { ReactNode } from 'react'

type ProtectedRouteProps = {
  role: UserRole
  children: ReactNode
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-void text-fog">
      <Loader2 className="h-8 w-8 animate-spin text-gold-400" aria-hidden />
    </div>
  )
}

export function OwnerProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, profileReady } = useAuth()

  if (loading || (isSupabaseConfigured() && !profileReady)) {
    return <LoadingScreen />
  }

  if (!user || user.role !== 'owner') {
    return <Navigate to="/404" replace />
  }

  return children
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, loading, profileReady } = useAuth()

  if (loading || (isSupabaseConfigured() && !profileReady)) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  if (user.role !== role) {
    return <Navigate to="/404" replace />
  }

  return children
}
